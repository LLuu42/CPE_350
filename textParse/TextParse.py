import sys

search_intent = {'search', 'Search'}

def parseCommand(string):
	for s in search_intent:
		if s == string.partition(' ')[0]:
			print("FOUND IT")

def main(argv):
	inputfile = open(argv[0])
	string = inputfile.read()
	command = parseCommand(string)

if __name__ == "__main__":
	main(sys.argv[1:])