import httplib
import sys

url = sys.argv[1]

conn = httplib.HTTPConnection(url)
conn.request("HEAD", "/")
r1 = conn.getresponse()
print r1.status, r1.reason