from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from .models import Cours

User = get_user_model()

class CourseTest(TestCase):

    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username="testuser",
            password="test12345"
        )

        self.course = Cours.objects.create(
            titre="Test Course",
            description="Desc",
            enseignant=self.user
        )

    def test_get_courses(self):
        response = self.client.get('/cours/')
        self.assertEqual(response.status_code, 200)

    def test_inscription(self):
        self.client.login(username='testuser', password='test12345')

        response = self.client.post(
            '/cours/inscription/',
            data='{"cours_id": 1}',
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)