from rest_framework import serializers
from .models import Faculty


class FacultySerializer(serializers.ModelSerializer):
    """Full serializer for Faculty CRUD operations."""

    performance_grade = serializers.ReadOnlyField()

    class Meta:
        model = Faculty
        fields = [
            'id',
            'name',
            'department',
            'subject',
            'feedback_score',
            'performance_score',
            'attendance_percentage',
            'performance_grade',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'performance_grade']

    # ── Validation ─────────────────────────────────────────────────────────
    def validate_feedback_score(self, value):
        if not (0 <= value <= 10):
            raise serializers.ValidationError('Feedback score must be between 0 and 10.')
        return value

    def validate_performance_score(self, value):
        if not (0 <= value <= 100):
            raise serializers.ValidationError('Performance score must be between 0 and 100.')
        return value

    def validate_attendance_percentage(self, value):
        if not (0 <= value <= 100):
            raise serializers.ValidationError('Attendance percentage must be between 0 and 100.')
        return value


class FacultyListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing faculty."""

    performance_grade = serializers.ReadOnlyField()

    class Meta:
        model = Faculty
        fields = [
            'id',
            'name',
            'department',
            'subject',
            'feedback_score',
            'performance_score',
            'attendance_percentage',
            'performance_grade',
        ]
