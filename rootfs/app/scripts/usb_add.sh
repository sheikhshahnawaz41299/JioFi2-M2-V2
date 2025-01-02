#!/bin/sh

SUCCESS=0

brctl show | busybox grep "usb0" >/dev/null 2>&1

if busybox [ "$?" -ne $SUCCESS ]
then
  brctl addif br0 usb0
  ifconfig usb0 0.0.0.0 up
fi
