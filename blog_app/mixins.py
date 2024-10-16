
from django.contrib.auth.mixins import UserPassesTestMixin

class EditorRequiredMixin(UserPassesTestMixin):
    def test_func(self):
        return hasattr(self.request.user, 'writer') and self.request.user.writer.is_editor
