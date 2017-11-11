from aiohttp import web


async def get_issues(request):
    org = request.match_info.get('org')
    project = request.match_info.get('project')

    cursor = request.app['db'].cursor()
    cursor.execute(
        'SELECT github_id, x, y FROM issues where org=? AND project=?;',
        (org, project),
    )
    result = [{
        'id': row[0],
        'x': row[1],
        'y': row[2],
    } for row in cursor.fetchall()]
    return web.json_response(result)


async def delete_issue(request):
    org = request.match_info.get('org')
    project = request.match_info.get('project')
    github_id = request.match_info.get('id')
    cursor = request.app['db'].cursor()
    cursor.execute(
        'DELETE FROM issues WHERE org=? AND project=? AND github_id=?;',
        (org, project, github_id),
    )
    request.app['db'].commit()
    return web.json_response({})


async def move_issue(request):
    org = request.match_info.get('org')
    project = request.match_info.get('project')
    github_id = request.match_info.get('id')
    data = await request.json()
    cursor = request.app['db'].cursor()
    cursor.execute(
        'SELECT id FROM issues where org=? AND project=? AND github_id=?;',
        (org, project, github_id),
    )
    result = cursor.fetchone()
    db_id = result[0] if result else None
    if db_id:
        cursor.execute(
            'UPDATE issues SET x=?, y=? WHERE id=?',
            (data.get('x', 0), data.get('y', 0), db_id),
        )
    else:
        cursor.execute(
            'INSERT INTO issues (org, project, github_id, x, y) '
            'VALUES (?,?,?,?,?);',
            (org, project, github_id, data.get('x', 0), data.get('y', 0)),
        )
    request.app['db'].commit()
    return web.json_response({})
