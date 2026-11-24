#!/bin/sh
# Live verification battery for realm-spring, against an appliance with this realm (and the realms it
# requires) installed. Every source the realm reads is public and keyless, so nothing but the
# appliance's address and a login is needed:
#
#   APPLIANCE=http://127.0.0.1:8080 AUTH=user:pass sh tests/verify.sh
#
# (EMBABEL_AUTH=user:pass is accepted in place of AUTH.) The ladder is in tests/verify.py:
#   L1 every view answers by name, on its defaults (a required param gets a fixed public value)
#   L2 figures reconciled against the sources read directly: spring.io's Spring Boot lines,
#      deps.dev's advisories and CVSS for one exact version, a pinned public project's endpoints
#      and Spring Boot version, GitHub's and Stack Overflow's own search
#   L3 cost: one version's advisories cost one call per record and nothing on a second read, and a
#      repeated support search is answered from the cache
# The last line on success is exactly `ALL CHECKS PASS`; any failure exits non-zero.
set -e
cd "$(dirname "$0")/.."
exec python3 tests/verify.py "$@"
