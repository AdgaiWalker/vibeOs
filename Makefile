.PHONY: link status test unlink

link:
	node scripts/link.mjs

status:
	node scripts/status.mjs

test:
	node --test tests/*.test.mjs

unlink:
	node scripts/unlink.mjs
