from tests.helpers import create_ctfd, destroy_ctfd
from CTFd.utils import get_config, set_config
from CTFd.utils.events import ServerSentEvent, EventManager
from freezegun import freeze_time
from mock import patch, Mock
from six.moves.queue import Queue
from collections import defaultdict
from email.mime.text import MIMEText
import requests
import json


def test_event_manager_installed():
    """Test that EventManager is installed on the Flask app"""
    app = create_ctfd()
    assert type(app.events_manager) == EventManager
    destroy_ctfd(app)


def test_event_manager_subscription():
    """Test that EventManager subscribing works"""
    with patch.object(Queue, 'get') as fake_queue:
        saved_data = {
            'user_id': None,
            'title': 'asdf',
            'content': 'asdf',
            'team_id': None,
            'user': None,
            'team': None,
            'date': '2019-01-28T01:20:46.017649+00:00',
            'id': 10
        }
        saved_event = {
            'type': 'notification',
            'data': saved_data
        }

        saved_event_string = 'event:notification\n'\
                             'data:{"content": "asdf", "team_id": null, "user_id": null, "user": null, "title": "asdf", "date": "2019-01-28T01:20:46.017649+00:00", "team": null, "id": 10}\n\n'

        fake_queue.return_value = saved_event
        event_manager = EventManager()
        for message in event_manager.subscribe():
            assert message.to_dict() == saved_event
            assert str(message) == saved_event_string
            assert len(event_manager.clients) == 1
            break


def test_event_manager_publish():
    """Test that EventManager publishing to clients works"""
    saved_data = {
        'user_id': None,
        'title': 'asdf',
        'content': 'asdf',
        'team_id': None,
        'user': None,
        'team': None,
        'date': '2019-01-28T01:20:46.017649+00:00',
        'id': 10
    }

    event_manager = EventManager()
    event_manager.clients.append(
        defaultdict(Queue)
    )
    event_manager.publish(data=saved_data, type='notification', channel='ctf')

    event = event_manager.clients[0]['ctf'].get()
    event = ServerSentEvent(**event)
    assert event.data == saved_data


def test_event_endpoint_is_event_stream():
    """Test that the /events endpoint is text/event-stream"""
    app = create_ctfd()
    with app.app_context(), app.test_client() as client:
        r = client.get('/events')
        assert "text/event-stream" in r.headers['Content-Type']
    destroy_ctfd(app)
