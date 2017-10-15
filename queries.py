# PLAYER queries

CREATE_PERSON = """CREATE TABLE IF NOT EXISTS person (
                       player_id   INTEGER PRIMARY KEY NOT NULL,
                       player_name TEXT UNIQUE NOT NULL,
                       email       TEXT UNIQUE NOT NULL,
                       password    TEXT NOT NULL,
                       join_date   DATE NOT NULL)"""


GET_ALL_PERSON = """SELECT *
                      FROM person"""


SELECT_PERSON = """SELECT *
                     FROM person
                    WHERE email=?"""

SELECT_PERSON_NAME = """SELECT *
                          FROM person
                         WHERE player_name=?"""

SELECT_PERSON_ID = """SELECT *
                        FROM person
                       WHERE player_id=?"""

ADD_PERSON = """INSERT INTO person (player_name, email, password, join_date)
                VALUES (?, ?, ?, ?)"""



# GAME queries

CREATE_GAME = """CREATE TABLE IF NOT EXISTS game (
                       game_id     INTEGER PRIMARY KEY,
                       game_type   INTEGER NOT NULL,
                       score       INTEGER NOT NULL,
                       [timestamp] TIMESTAMP NOT NULL,
                       player_id   INTEGER NOT NULL,
                       FOREIGN KEY(player_id) REFERENCES person(player_id))"""


ADD_GAME = """INSERT INTO game (game_type, score, timestamp, player_id)
              VALUES (?, ?, ?, ?)"""


GET_PLAYER_GAMES = """SELECT game_id, game_type, score
                        FROM game
                  INNER JOIN person
                          ON game.player_id = person.player_id
                       WHERE person.player_id=?"""


BEST_SCORE = """SELECT MAX(score) AS best_score
                  FROM game
            INNER JOIN person
                    ON game.player_id = person.player_id
                 WHERE game_type=?
                   AND person.player_id=?"""


AVERAGE_SCORE = """SELECT AVG(score) AS average_score
                     FROM game
               INNER JOIN person
                       ON game.player_id = person.player_id
                    WHERE game_type=?
                      AND person.player_id=?"""


ALL_SCORES = """SELECT score
                  FROM game
            INNER JOIN person
                    ON game.player_id = person.player_id
                 WHERE game_type=? 
                   AND person.player_id=?
                 ORDER BY score DESC"""
