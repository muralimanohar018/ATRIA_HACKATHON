import os
import yagmail
from ..config import Config

def send_email(to: str, subject: str, body: str) -> bool:
    if not Config.SENDER_EMAIL or not Config.SENDER_PASSWORD:
        return False
    try:
        yag = yagmail.SMTP(Config.SENDER_EMAIL, Config.SENDER_PASSWORD)
        yag.send(to=to, subject=subject, contents=body)
        return True
    except Exception:
        return False

