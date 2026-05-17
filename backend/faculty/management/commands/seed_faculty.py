"""
Management command to seed sample faculty data and create a default admin.

Usage:
    python manage.py seed_faculty
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from faculty.models import Faculty

User = get_user_model()

SAMPLE_FACULTY = [
    {'name': 'Dr. Aisha Sharma', 'department': 'Computer Science', 'subject': 'Data Structures', 'feedback_score': 8.7, 'performance_score': 88.5, 'attendance_percentage': 95.0},
    {'name': 'Prof. Rajan Mehta', 'department': 'Computer Science', 'subject': 'Machine Learning', 'feedback_score': 9.2, 'performance_score': 93.0, 'attendance_percentage': 98.0},
    {'name': 'Dr. Priya Nair', 'department': 'Computer Science', 'subject': 'Database Systems', 'feedback_score': 7.8, 'performance_score': 80.0, 'attendance_percentage': 90.5},
    {'name': 'Dr. Suresh Kumar', 'department': 'Electronics', 'subject': 'Digital Circuits', 'feedback_score': 8.1, 'performance_score': 82.0, 'attendance_percentage': 92.0},
    {'name': 'Prof. Kavya Reddy', 'department': 'Electronics', 'subject': 'VLSI Design', 'feedback_score': 9.0, 'performance_score': 91.5, 'attendance_percentage': 97.0},
    {'name': 'Dr. Amit Joshi', 'department': 'Mechanical', 'subject': 'Thermodynamics', 'feedback_score': 7.5, 'performance_score': 76.0, 'attendance_percentage': 88.0},
    {'name': 'Prof. Neha Singh', 'department': 'Mechanical', 'subject': 'Fluid Mechanics', 'feedback_score': 8.3, 'performance_score': 84.0, 'attendance_percentage': 93.0},
    {'name': 'Dr. Vikram Patel', 'department': 'Civil', 'subject': 'Structural Engineering', 'feedback_score': 8.6, 'performance_score': 87.0, 'attendance_percentage': 94.5},
    {'name': 'Prof. Deepa Thomas', 'department': 'Mathematics', 'subject': 'Linear Algebra', 'feedback_score': 9.4, 'performance_score': 95.0, 'attendance_percentage': 99.0},
    {'name': 'Dr. Sanjay Gupta', 'department': 'Physics', 'subject': 'Quantum Mechanics', 'feedback_score': 8.0, 'performance_score': 81.5, 'attendance_percentage': 91.0},
    {'name': 'Prof. Meena Iyer', 'department': 'Chemistry', 'subject': 'Organic Chemistry', 'feedback_score': 7.6, 'performance_score': 78.0, 'attendance_percentage': 89.0},
    {'name': 'Dr. Rajesh Verma', 'department': 'Management', 'subject': 'Business Analytics', 'feedback_score': 8.9, 'performance_score': 90.0, 'attendance_percentage': 96.0},
]


class Command(BaseCommand):
    help = 'Seeds the database with sample faculty data and creates a default admin user.'

    def handle(self, *args, **options):
        # Create default superuser
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@faculty.edu',
                password='admin123',
            )
            self.stdout.write(self.style.SUCCESS('[OK] Created admin user: admin / admin123'))
        else:
            self.stdout.write(self.style.WARNING('[INFO] Admin user already exists.'))

        # Seed faculty
        created_count = 0
        for data in SAMPLE_FACULTY:
            obj, created = Faculty.objects.get_or_create(
                name=data['name'],
                defaults=data,
            )
            if created:
                created_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'[OK] Seeded {created_count} new faculty records '
                f'({len(SAMPLE_FACULTY) - created_count} already existed).'
            )
        )
