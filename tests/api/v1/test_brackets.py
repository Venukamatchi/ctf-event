from CTFd.models import Brackets
from tests.helpers import (
    create_ctfd,
    destroy_ctfd,
    gen_bracket,
    login_as_user,
    register_user,
)


def test_get_brackets_api():
    """Test that brackets API GET endpiont is behaving propertly"""
    app = create_ctfd()
    with app.app_context():
        gen_bracket(app.db, name="players1")
        with app.test_client() as client:
            client.get("/register")
            with client.session_transaction() as sess:
                data = {
                    "name": "user",
                    "email": "user@examplectf.com",
                    "password": "password",
                    "bracket_id": 1,
                    "nonce": sess.get("nonce"),
                }
            client.post("/register", data=data)
            client = login_as_user(app, raise_for_error=True)
            r = client.get("/api/v1/brackets?type=users")
            resp = r.get_json()
            print(resp)
            assert r.status_code == 200
            assert resp["data"][0]["name"] == "players1"
            assert resp["data"][0]["description"] == "players who are part of the test"
    destroy_ctfd(app)


def test_delete_brackets_api():
    """Test that brackets API DELETE endpiont is behaving propertly"""
    app = create_ctfd()
    with app.app_context():
        gen_bracket(app.db, name="players1")
        assert Brackets.query.count() == 1

        register_user(app, bracket_id=1)
        with login_as_user(app) as client:
            r = client.delete("/api/v1/brackets/1", json="")
            assert r.status_code == 403
            assert Brackets.query.count() == 1

        with login_as_user(app, name="admin") as client:
            r = client.delete("/api/v1/brackets/1", json="")
            print(r.get_json())
            assert r.status_code == 200
            assert Brackets.query.count() == 0
    destroy_ctfd(app)
