#!/bin/sh

SUCCESS=0

USB_ETH_NAME=$1
MACADDR=$2

brctl show | busybox grep "$USB_ETH_NAME" >/dev/null 2>&1

if busybox [ "$?" -ne $SUCCESS ]
then
  brctl delif br0 $USB_ETH_NAME 2> /dev/null
  brctl addif br0 $USB_ETH_NAME
  ifconfig $USB_ETH_NAME hw ether ${MACADDR}
  ifconfig $USB_ETH_NAME 0.0.0.0 up
fi
