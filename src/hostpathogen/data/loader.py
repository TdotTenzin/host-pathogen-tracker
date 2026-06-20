"""
loader.py — SQLite connection and query helpers.

This is the public API for accessing the hostpathogen database.
All other modules import from here rather than using sqlite3 directly.
"""

import sqlite3
import pathlib

import pandas as pd

# Path to the pre-built database (relative to this file)
DB_PATH = pathlib.Path(__file__).parent / "hostpathogen.db"


def get_connection() -> sqlite3.Connection:
    """
    Open a connection to hostpathogen.db with row_factory set
    so rows can be accessed by column name (like a dict).
    """
    con = sqlite3.connect(str(DB_PATH))
    con.row_factory = sqlite3.Row
    con.execute("PRAGMA foreign_keys = ON")
    return con


def query(sql: str, params: tuple | None = None) -> list[sqlite3.Row]:
    """
    Execute a SELECT query and return the result as a list of Row objects.
    Each Row can be accessed like r['column_name'].

    Example:
        rows = query("SELECT * FROM pathogens WHERE strategy = ?", ("arrest",))
        for r in rows:
            print(r["name"], r["gram_stain"])
    """
    con = get_connection()
    try:
        if params:
            rows = con.execute(sql, params).fetchall()
        else:
            rows = con.execute(sql).fetchall()
        return rows
    finally:
        con.close()


def to_df(sql: str, params: tuple | None = None) -> pd.DataFrame:
    """
    Execute a SELECT query and return the result as a pandas DataFrame.
    Column names come from the SQL SELECT clause.

    Example:
        >>> df = to_df('''
        ...     SELECT p.name AS pathogen, e.name AS effector
        ...     FROM effectors e
        ...     JOIN pathogens p ON e.pathogen_id = p.id
        ... ''')
        >>> print(df.head())
    """
    con = get_connection()
    try:
        return pd.read_sql_query(sql, con, params=params)
    finally:
        con.close()
