from django.contrib import admin
from .models import Faculty


@admin.register(Faculty)
class FacultyAdmin(admin.ModelAdmin):
    list_display = ['name', 'department', 'subject', 'performance_score', 'feedback_score', 'attendance_percentage']
    list_filter = ['department']
    search_fields = ['name', 'subject']
    ordering = ['-created_at']
