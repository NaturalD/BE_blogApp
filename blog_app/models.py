from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class Writer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_editor = models.BooleanField(default=False)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Article(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    created_at = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=255)
    content = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    written_by = models.ForeignKey(Writer, related_name='articles_written', on_delete=models.CASCADE)
    edited_by = models.ForeignKey(Writer, related_name='articles_edited', null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.title

