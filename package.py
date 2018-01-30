import os
import zipfile

OUTPUTNAME = "dist.zip"

ADD_FILES = ["dist/jquery/jquery.min.js", "dist/semantic-ui/semantic.min.css", "dist/semantic-ui/semantic.min.js", 
			 "dist/semantic-ui-calendar/calendar.min.css", "dist/semantic-ui-calendar/calendar.min.js", "icons/icon.png", "icons/icon-48.png", "icons/icon-96.png",
			 "main.js", "main.html", "manifest.json"]

if __name__ == "__main__":
	currentDir = os.path.dirname(os.path.realpath(__file__))
	z = zipfile.ZipFile((currentDir + os.path.sep + OUTPUTNAME), "w", zipfile.ZIP_DEFLATED)
	for f in ADD_FILES:
		p = os.path.expanduser(f)
		z.write(p)
