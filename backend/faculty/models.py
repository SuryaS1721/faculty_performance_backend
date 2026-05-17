from django.db import models


DEPARTMENT_CHOICES = [
    ('Computer Science', 'Computer Science'),
    ('Electronics', 'Electronics'),
    ('Mechanical', 'Mechanical'),
    ('Civil', 'Civil'),
    ('Mathematics', 'Mathematics'),
    ('Physics', 'Physics'),
    ('Chemistry', 'Chemistry'),
    ('Management', 'Management'),
    ('Other', 'Other'),
]


class Faculty(models.Model):
    """Represents a faculty member with performance metrics."""

    name = models.CharField(max_length=200)
    department = models.CharField(max_length=100, choices=DEPARTMENT_CHOICES)
    subject = models.CharField(max_length=200)
    feedback_score = models.FloatField(
        help_text='Student feedback score (0–10)',
        default=0.0,
    )
    performance_score = models.FloatField(
        help_text='Overall performance score (0–100)',
        default=0.0,
    )
    attendance_percentage = models.FloatField(
        help_text='Attendance percentage (0–100)',
        default=0.0,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Faculty'

    def __str__(self):
        return f'{self.name} — {self.department}'

    @property
    def performance_grade(self):
        """Returns a letter grade based on performance_score."""
        score = self.performance_score
        if score >= 90:
            return 'A+'
        elif score >= 80:
            return 'A'
        elif score >= 70:
            return 'B'
        elif score >= 60:
            return 'C'
        else:
            return 'D'
