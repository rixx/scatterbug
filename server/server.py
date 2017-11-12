import os
import sqlite3

from aiohttp import web

from routes import setup_routes


async def init_db(app):
    connection = sqlite3.connect('scatterbug.db')
    cursor = connection.cursor()
    cursor.execute(
        'CREATE TABLE IF NOT EXISTS issues '
        '(id integer unique primary key, org text, project text, '
        'github_id integer, x float, y float, token text)'
    )
    connection.commit()
    app['db'] = connection


app = web.Application()
app.on_startup.append(init_db)
setup_routes(app)

async def on_prepare(request, response):
    response.headers['Access-Control-Allow-Origin'] = '*'

app.on_response_prepare.append(on_prepare)

DEBUG = os.environ.get('SCATTERBUG_DEBUG', False)
if DEBUG:
    web.run_app(app, host='localhost', port=8080)
