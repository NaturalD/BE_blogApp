
from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from .models import Writer, Article

class ArticleModelTest(TestCase):
    def setUp(self):
        user = User.objects.create_user(username='testuser', password='testpass')
        self.writer = Writer.objects.create(user=user, name='Test Writer')
        self.article = Article.objects.create(
            title='Test Article',
            content='Test Content',
            written_by=self.writer
        )

    def test_article_creation(self):
        self.assertEqual(self.article.title, 'Test Article')
        self.assertEqual(self.article.written_by.name, 'Test Writer')

class DashboardViewTest(TestCase):
    def test_dashboard_view(self):
        response = self.client.get(reverse('dashboard'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Dashboard')

class ArticleCreateViewTest(TestCase):
    def setUp(self):
        user = User.objects.create_user(username='writer', password='pass')
        self.writer = Writer.objects.create(user=user, name='Writer')
        self.client.login(username='writer', password='pass')

    def test_create_article(self):
        response = self.client.post(reverse('article-create'), {
            'title': 'New Article',
            'content': 'Content here',
        })
        self.assertEqual(response.status_code, 302)
        self.assertTrue(Article.objects.filter(title='New Article').exists())
