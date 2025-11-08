import os
import yagmail
from io import BytesIO
from ..config import Config

def send_email(to: str, subject: str, body: str, attachments: list = None) -> bool:
    """
    Send email with optional attachments.
    
    Args:
        to: Recipient email address
        subject: Email subject
        body: Email body (HTML or plain text)
        attachments: List of attachments. Each can be:
            - String path to file
            - Tuple (filename, BytesIO object)
            - Tuple (filename, bytes)
    
    Returns:
        True if sent successfully, False otherwise
    """
    if not Config.SENDER_EMAIL or not Config.SENDER_PASSWORD:
        print(f"⚠️  Email not configured. SENDER_EMAIL: {bool(Config.SENDER_EMAIL)}, SENDER_PASSWORD: {bool(Config.SENDER_PASSWORD)}")
        return False
    
    try:
        yag = yagmail.SMTP(Config.SENDER_EMAIL, Config.SENDER_PASSWORD)
        
        # Prepare attachments
        attach_list = []
        if attachments:
            for att in attachments:
                if isinstance(att, tuple):
                    # (filename, BytesIO or bytes)
                    filename, content = att
                    if isinstance(content, BytesIO):
                        content.seek(0)
                        attach_list.append({filename: content.read()})
                    elif isinstance(content, bytes):
                        attach_list.append({filename: content})
                    else:
                        attach_list.append({filename: content})
                elif isinstance(att, str):
                    # File path
                    if os.path.exists(att):
                        attach_list.append(att)
        
        # Send email
        if attach_list:
            yag.send(to=to, subject=subject, contents=body, attachments=attach_list)
            print(f"✅ Email sent to {to} with {len(attach_list)} attachment(s)")
        else:
            yag.send(to=to, subject=subject, contents=body)
            print(f"✅ Email sent to {to}")
        
        return True
    except Exception as e:
        print(f"❌ Error sending email to {to}: {str(e)}")
        import traceback
        print(traceback.format_exc())
        return False

