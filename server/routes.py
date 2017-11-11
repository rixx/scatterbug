from views import get_issues, move_issue, delete_issue


def setup_routes(app):
    issues = app.router.add_resource('/{org}/{project}/issues')
    issues.add_route('GET', get_issues)

    issue = app.router.add_resource('/{org}/{project}/issues/{id:\d+}')
    issue.add_route('POST', move_issue)
    issue.add_route('DELETE', delete_issue)
