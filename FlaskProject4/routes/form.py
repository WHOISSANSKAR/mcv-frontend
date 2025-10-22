from flask import Blueprint, request, jsonify
from database import get_db_connection
import datetime

form_bp = Blueprint('form', __name__)

@form_bp.route('/submit', methods=['POST'])
def submit_form():
    company_name = request.form.get('company_name')
    cin = request.form.get('cin')
    subscribers = request.form.get('subscribers')
    subscribers = None if not subscribers or int(subscribers) == 0 else int(subscribers)

    govt_document = request.files.get('govt_document')

    if not company_name or not govt_document or not cin:
        return jsonify({"error": "Company Name, Govt Document, and CIN are required"}), 400

    # Read file as binary
    file_data = govt_document.read()

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Check if CIN already exists
        cursor.execute("SELECT * FROM user_group WHERE usgrp_cin = %s", (cin,))
        existing_company = cursor.fetchone()
        if existing_company:
            return jsonify({"error": "Company already registered with this CIN"}), 400

        # Insert into DB
        cursor.execute("""
            INSERT INTO user_group
            (usgrp_company_name, usgrp_last_updated, usgrp_govt_document, usgrp_cin, usgrp_subscribers)
            VALUES (%s, %s, %s, %s, %s)
        """, (company_name, datetime.datetime.now(), file_data, cin, subscribers))

        conn.commit()
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

    return jsonify({"message": "Company details submitted successfully"}), 201


@form_bp.route('/all', methods=['GET'])
def get_forms():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT usgrp_id, usgrp_company_name, usgrp_cin, usgrp_subscribers, usgrp_last_updated
        FROM user_group
        ORDER BY usgrp_id DESC
    """)
    results = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(results), 200
