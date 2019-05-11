# import the necessary packages
from picamera.array import PiRGBArray
from picamera import PiCamera
import time
import cv2
import datetime
import os
#S3
import boto3
s3 = boto3.client('s3')
import png
# initialize the camera and grab a reference to the raw camera capture

camera = PiCamera()
camera.resolution = (640, 480)
camera.framerate = 32
rawCapture = PiRGBArray(camera, size=(640, 480))
 
num_face = 0
flicker_ctr = 0
image_ctr = 0
from PIL import Image
from io import BytesIO

# allow the camera to warmup
time.sleep(0.1)

face_cascade = cv2.CascadeClassifier('/home/pi/opencv/data/haarcascades/haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier('/home/pi/opencv/data/haarcascades/haarcascade_eye.xml')
num_faces = 0
flicker_ctr = 0

# capture frames from the camera
for frame in camera.capture_continuous(rawCapture, format="bgr", use_video_port=True):
	# grab the raw NumPy array representing the image, then initialize the timestamp
	# and occupied/unoccupied text
	
	image = frame.array
	yuv = cv2.cvtColor(image,cv2.COLOR_BGR2YUV)
	yuv[:,:,0] = cv2.equalizeHist(yuv[:,:,0])
	image = cv2.cvtColor(yuv,cv2.COLOR_YUV2BGR)
	disp_image = image.copy()
		#yuv = cv2.cvtColor(image,cv2.COLOR_BGR2YUV)
		#yuv[:,:,0] = cv2.equalizeHist(yuv[:,:,0])
		#image = cv2.cvtColor(yuv,cv2.YUV2BGR)

	gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

	faces = face_cascade.detectMultiScale( gray,1.3,5)

	# Draw a rectangle around the faces
	
	for (x, y, w, h) in faces:
		 	cv2.rectangle(disp_image, (x, y), (x+w, y+h), (0, 255, 0), 2)

	# cv2.imwrite('newobama.png', image)

	# 	#one way
	# 	# img = Image.fromarray(image)
	# 	# out_img = BytesIO()
	# 	# img.save(out_img, format='png')
	# 	# out_img.seek(0)
	# 	# s3.put_object(Bucket="surveillance-cam", Key = imageName, Body = out_img, ContentType= 'image/png')	

	if num_face != len(faces):
		flicker_ctr += 1
	else:
		flicker_ctr = 0


	if flicker_ctr > 5:
			# snap pic
		user = "aa6911"
		imagePath = "./collectedImages/"
		imageName = user+"/"+ str(time.time()).split(".")[0] + '.png'
			# cv2.imwrite(imageName, image)

			#one way
			# img = Image.fromarray(image)
			# out_img = BytesIO()
			# img.save(out_img, format='png')
			# out_img.seek(0)
			# s3.put_object(Bucket="surveillance-cam", Key = imageName, Body = out_img, ContentType= 'image/png')	

			#otherway
		print(imageName,imagePath + user,imagePath + imageName)
		if not os.path.exists(imagePath+user):
			os.makedirs(imagePath+user)
		cv2.imwrite(imagePath + imageName , image)
		
		local_image = open(imagePath + imageName, 'rb')

		s3.put_object(Bucket="surveillance-cam", Key = imageName, Body = local_image, ContentType= 'image/png')	

	
		image_ctr +=1
		num_face = len(faces)
		flicker_ctr = 0
	print("Num_faces",num_face)
	print("Flicker",flicker_ctr)

		# show the frame
	cv2.imshow("Frame", disp_image)
	key = cv2.waitKey(1) & 0xFF
 
	# clear the stream in preparation for the next frame
	rawCapture.truncate(0)
 
	# if the `q` key was pressed, break from the loop
	if key == ord("q"):
		break
