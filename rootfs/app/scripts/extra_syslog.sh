#!/bin/sh
#set -x

pre_syslog_in_app=0
syslod_sd=/media/card/syslog

ps | grep "syslogd" | grep "/app/var/log/messages"
if [ $? == 0 ]; then
    pre_syslog_in_app=1
fi

if [ -f /ww_data/nv/log2sdcard ]; then
    at_tools ven_get_sdst | grep "RESULT: 1"
    if [ $? == 0 ]; then
        if [ ${pre_syslog_in_app} == 1 ]; then
            year=`date +%Y`
            if [ $year == 1970 ]; then
                max_id=10
                for i in $(seq 1 ${max_id})
                do
                    if [ ! -d ${syslod_sd}/1970-$i ]; then
                        if [ $i == $max_id ]; then
                            rm -rf ${syslod_sd}/1970-1
                        else
                            rm -rf ${syslod_sd}/1970-$(expr $i + 1)
                        fi
                        syslod_sd_path=${syslod_sd}/1970-$i
                        break
                    fi
                done
            else
                time=`date +%Y%m%d-%H%M%S`
                syslod_sd_path=${syslod_sd}/${time}
            fi
            
            mkdir -p ${syslod_sd_path}
            mv -f ${syslod_sd}/log_path_now ${syslod_sd}/log_path_lasttime
            echo ${syslod_sd_path} > ${syslod_sd}/log_path_now

            start-stop-daemon -K -n syslogd

            cp /app/var/log/messages ${syslod_sd_path}/messages.-1 2> /dev/null
            cp /app/var/log/messages.0 ${syslod_sd_path}/messages.-2 2> /dev/null

            /sbin/syslogd -n -O ${syslod_sd_path}/messages -s 4096 -b 99 &
            exit 0
        fi
    fi
fi

if [ ${pre_syslog_in_app} == 0 ]; then
    start-stop-daemon -K -n syslogd
    rm -f /app/var/log/messages*
    /sbin/syslogd -n -O /app/var/log/messages -s 512 -b 1 &
fi

