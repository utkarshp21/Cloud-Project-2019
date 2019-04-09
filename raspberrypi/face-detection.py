# import the necessary packages
from picamera.array import PiRGBArray
from picamera import PiCamera
import time
import cv2

#S3
import boto3
s3 = boto3.client('s3')
import png
# initialize the camera and grab a reference to the raw camera capture
camera = PiCamera()
camera.resolution = (640, 480)
camera.framerate = 32
rawCapture = PiRGBArray(camera, size=(640, 480))
 

from PIL import Image
from io import BytesIO

# allow the camera to warmup
time.sleep(0.1)

face_cascade = cv2.CascadeClassifier('/home/pi/opencv/data/haarcascades/haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier('/home/pi/opencv/data/haarcascades/haarcascade_eye.xml')

# capture frames from the camera
for frame in camera.capture_continuous(rawCapture, format="bgr", use_video_port=True):
	# grab the raw NumPy array representing the image, then initialize the timestamp
	# and occupied/unoccupied text
	
	image = frame.array

	gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

	faces = face_cascade.detectMultiScale(
		gray,
		scaleFactor=1.1,
		minNeighbors=5,
		minSize=(30, 30),
		flags=cv2.CASCADE_SCALE_IMAGE
	)

	

	# Draw a rectangle around the faces
	
	# for (x, y, w, h) in faces:
	# 	cv2.rectangle(image, (x, y), (x+w, y+h), (0, 255, 0), 2)

	# cv2.imwrite('newobama.png', image)
	
	if len(faces):
		imagePath = "./collectedImages/"
		imageName = str(time.strftime("%Y_%m_%d_%H_%M")) + '.png'
		# cv2.imwrite(imageName, image)

		#one way
		# img = Image.fromarray(image)
		# out_img = BytesIO()
		# img.save(out_img, format='png')
		# out_img.seek(0)
		# s3.put_object(Bucket="surveillance-cam", Key = imageName, Body = out_img, ContentType= 'image/png')	

		#otherway
		cv2.imwrite(imagePath+imageName, image)
		local_image = open(imagePath+imageName, 'rb')
		s3.put_object(Bucket="surveillance-cam", Key = imageName, Body = local_image, ContentType= 'image/png')	


	# show the frame
	cv2.imshow("Frame", image)
	key = cv2.waitKey(1) & 0xFF
 
	# clear the stream in preparation for the next frame
	rawCapture.truncate(0)
 
	# if the `q` key was pressed, break from the loop
	if key == ord("q"):
		break