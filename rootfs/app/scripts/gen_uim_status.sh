#!/bin/sh

var_path=`cat /app/config/var.conf`
no_sim="+CME ERROR: SIM not inserted"

for i in 1 2 3
do
	cpin=`at_test at+cpin? | busybox grep '+CPIN\|+CME'`

	if [ -z "${cpin}" ]
	then
		continue
	fi
	echo "${cpin}" | busybox grep "${no_sim}"
	if [ $? -eq 0 ]
	then
		busybox echo 0 >  ${var_path}/modem/sim_st
	else
		busybox echo 1 >  ${var_path}/modem/sim_st
	fi
	break
done

