from django.db.models import Avg, Count, Max, Min
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from .models import Faculty
from .serializers import FacultySerializer, FacultyListSerializer


# ─── Authentication ───────────────────────────────────────────────────────────

class LoginView(APIView):
    """Authenticate an admin user and return JWT tokens."""
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'error': 'Username and password are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(username=username, password=password)
        if user is None:
            return Response(
                {'error': 'Invalid credentials. Please try again.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.is_staff:
            return Response(
                {'error': 'Access restricted to admin users only.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_staff': user.is_staff,
            },
        })


class LogoutView(APIView):
    """Blacklist the refresh token to log out."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
        except Exception:
            pass  # token may already be expired / invalid
        return Response({'message': 'Logged out successfully.'})


# ─── Faculty ViewSet ──────────────────────────────────────────────────────────

class FacultyViewSet(viewsets.ModelViewSet):
    """
    CRUD + custom analytics endpoints for Faculty.

    list:   GET  /api/faculty/
    create: POST /api/faculty/
    retrieve: GET  /api/faculty/{id}/
    update:   PUT  /api/faculty/{id}/
    destroy:  DELETE /api/faculty/{id}/
    stats:            GET /api/faculty/stats/
    department_analysis: GET /api/faculty/department_analysis/
    """

    queryset = Faculty.objects.all()
    serializer_class = FacultySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'department', 'subject']
    ordering_fields = ['name', 'department', 'performance_score', 'feedback_score', 'attendance_percentage', 'created_at']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return FacultyListSerializer
        return FacultySerializer

    # ── Custom Actions ──────────────────────────────────────────────────────

    @action(detail=False, methods=['get'], url_path='stats')
    def stats(self, request):
        """Return aggregated statistics for the dashboard."""
        qs = Faculty.objects.all()
        total = qs.count()

        if total == 0:
            return Response({
                'total_faculty': 0,
                'avg_feedback_score': 0,
                'avg_performance_score': 0,
                'avg_attendance_percentage': 0,
                'top_performer': None,
                'departments_count': 0,
            })

        agg = qs.aggregate(
            avg_feedback=Avg('feedback_score'),
            avg_performance=Avg('performance_score'),
            avg_attendance=Avg('attendance_percentage'),
            max_performance=Max('performance_score'),
        )

        top_performer = qs.filter(
            performance_score=agg['max_performance']
        ).first()

        departments_count = qs.values('department').distinct().count()

        return Response({
            'total_faculty': total,
            'avg_feedback_score': round(agg['avg_feedback'] or 0, 2),
            'avg_performance_score': round(agg['avg_performance'] or 0, 2),
            'avg_attendance_percentage': round(agg['avg_attendance'] or 0, 2),
            'top_performer': {
                'name': top_performer.name,
                'department': top_performer.department,
                'performance_score': top_performer.performance_score,
            } if top_performer else None,
            'departments_count': departments_count,
        })

    @action(detail=False, methods=['get'], url_path='department_analysis')
    def department_analysis(self, request):
        """Return per-department aggregated metrics."""
        data = (
            Faculty.objects.values('department')
            .annotate(
                count=Count('id'),
                avg_feedback=Avg('feedback_score'),
                avg_performance=Avg('performance_score'),
                avg_attendance=Avg('attendance_percentage'),
                max_performance=Max('performance_score'),
                min_performance=Min('performance_score'),
            )
            .order_by('department')
        )

        result = []
        for dept in data:
            result.append({
                'department': dept['department'],
                'faculty_count': dept['count'],
                'avg_feedback_score': round(dept['avg_feedback'] or 0, 2),
                'avg_performance_score': round(dept['avg_performance'] or 0, 2),
                'avg_attendance_percentage': round(dept['avg_attendance'] or 0, 2),
                'max_performance_score': round(dept['max_performance'] or 0, 2),
                'min_performance_score': round(dept['min_performance'] or 0, 2),
            })

        return Response(result)
