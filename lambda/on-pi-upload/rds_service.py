import json
import sys
import pymysql

rds_host  = "smart-door-bell.cte6mbz5fnza.us-east-1.rds.amazonaws.com"
name = "admin"
password = "admin123"
db_name = "admin"

def getConn():
    try:
        conn = pymysql.connect(rds_host, user=name, passwd=password, db=db_name, connect_timeout=5)
        return conn
    except Exception as e:
        print("Error in connecting to db")
        print(e)
    return None    

def get_user_id_for_image(face_id, owner_id):
    print("Retrieve user id for face_id[" + face_id + "] and owner[" + owner_id + "]")
    conn = getConn()
    sql = "select user_id from images_cc_proj where owner_id = '%s' and face_id = '%s'" % (owner_id, face_id)
    user_id = None
    with conn.cursor() as cur:
        cur.execute(sql)
        for row in cur:
            user_id = row[0]
    conn.commit()
    if user_id is not None:
        print ("Returning user id : {} for input face_id id : {}".format(user_id, face_id))
        return user_id
    print("No Users Found")
    return None

def put_face_record(face_id, user_id, s3_path, owner_id, bounding_box_str, inserted_time, tagged_by):

    print("Inserting Face Record[%s] for user[%s], owner[%s]" % (face_id, user_id, owner_id))
    conn = getConn()
    sql = 'insert into images_cc_proj (face_id, owner_id, user_id, s3_path, inserted_time, tagged_by, bounding_box)' \
    + 'values("%s", "%s", "%s", "%s", %s, "%s", "%s")' % (face_id, owner_id, user_id, s3_path, inserted_time, tagged_by, bounding_box_str)
    with conn.cursor() as cur:
        cur.execute(sql)        
    conn.commit()       
    print("Insertion for Face Record Done")

def put_user_record(user_id, device_owner_id, tagged, user_name, timestamp):

    print("Inserting User Record[" + user_id + "] for owner[" + device_owner_id + "]")
    conn = getConn()
    sql = 'insert into users_cc_proj (user_id, owner_id, tagged, user_name, tagged_time)' \
    + 'values("%s", "%s", %s, "%s", %s)' % (user_id, device_owner_id, tagged, user_name, timestamp)
    with conn.cursor() as cur:
        cur.execute(sql)
    conn.commit()
    print("Insertion for User Record Done")  
    
    # TODO implement
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
    
    
    
