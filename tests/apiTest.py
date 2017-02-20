import httplib
conn = httplib.HTTPConnection("localhost:3000")
conn.request("HEAD", "/")
r1 = conn.getresponse()
print r1.status, r1.reason