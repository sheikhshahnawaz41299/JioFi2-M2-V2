#!/bin/sh

var_path=`cat /app/config/var.conf`

# imsi
imsi=`at_test at+cimi | busybox grep ^[0-9] | busybox tr -d "\n\r"`
if [ -n "$imsi" ]; then
  busybox echo -n $imsi >  ${var_path}/modem/imsi
else
  busybox rm -rf ${var_path}/modem/imsi
fi

