#!/bin/sh

var_path=`cat /app/config/var.conf`

# spn
spn=`at_test at^spn | busybox grep SPN:`
spn=${spn#*\"}
spn=${spn%\"*}
if [ -n "$spn" ];then
  busybox echo -n $spn > ${var_path}/modem/spn
else
  busybox rm -rf ${var_path}/modem/spn
fi

