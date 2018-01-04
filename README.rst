scatterbug
----------

``scatterbug`` allows you to place your GitHub issues on a chart. It's as easy as that.

You navigate to ``somewhe.re/myorg/myrepo/secret`` and you can push around issues on a map!
Only people with that link (i.e. your secret token) will be able to see and your issue map.

Running it
==========

Run the server by installing the (three. yes.) dependencies in a Python 3.5+ virtualenv, then execute
``gunicorn server:app --bind localhost:8080 --worker-class aiohttp.GunicornWebWorker``. You can also
ignore gunicorn and just run ``SCATTERBUG_DEBUG=True python server.py``.

Run the frontend by running ``npm install`` in the ``client/`` directory, then running ``npm start``.
To build the frontend for production, run ``npm run build``, maybe adjust the URL given
in ``config.prod.js`` beforehand. You'll find the build output in the ``dist/`` directory.

What's missing
==============

- Proper installation instructions. The above are the result of two minutes of work, so they assume
  that you know all the tech. Pull requests welcome.
- Filtering for text or for labels. We already pull all the GitHub information, so we should be
  able to filter for labels just by selecting them. And milestones. And contibut… look, it's feature
  creep, it's a perfectly natural software stage, okay?
