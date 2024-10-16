from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Writer, Article
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# User Registration Serializer
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    is_editor = serializers.BooleanField(required=False, write_only=True)
    name = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'is_editor', 'name']

    def create(self, validated_data):
        username = validated_data['username']
        password = validated_data['password']
        is_editor = validated_data.get('is_editor', False)
        name = validated_data.get('name', '')

        # Create the User instance
        user = User.objects.create_user(username=username, password=password)

        # Create the associated Writer instance
        Writer.objects.create(user=user, is_editor=is_editor, name=name)

        return user

# Article Serializer
class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ['id', 'title', 'content', 'status', 'created_at', 'written_by', 'edited_by']
        read_only_fields = ['created_at', 'written_by', 'edited_by']

    def create(self, validated_data):
        # Extract written_by from the context (request user)
        writer = self.context['request'].user.writer

        # Remove 'written_by' from validated_data if it exists
        if 'written_by' in validated_data:
            validated_data.pop('written_by')

        # Create the Article with the provided data and the writer
        return Article.objects.create(written_by=writer, **validated_data)

# Writer Serializer
class WriterSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Writer
        fields = ['user', 'is_editor', 'name']

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)

        # Add custom data
        user = self.user
        data['is_editor'] = user.writer.is_editor

        return data
