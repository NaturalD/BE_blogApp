from rest_framework import permissions

class IsEditorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow editors to edit objects.
    Writers can only view objects.
    """
    def has_permission(self, request, view):
        # Editors can edit, others can only read
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.writer.is_editor
