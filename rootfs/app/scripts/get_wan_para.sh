#!/bin/sh

var_path=`cat /app/config/var.conf`

tmp_dir="${var_path}/modem"
nv_path="/ww_data/nv"

apn_mode=`cat ${nv_path}/usb3g_apn_mode`
if [ ${apn_mode} -eq 0 ]
then
  cat /dev/null > ${tmp_dir}/apn
  cat /dev/null > ${tmp_dir}/username
  cat /dev/null > ${tmp_dir}/password
else
  apn_active=`cat ${nv_path}/apn_active`
  if [ ${apn_active} -gt 2 ]
  then
    apn_active=0
  fi

  cat ${nv_path}/usb3g_apn_${apn_active} > ${tmp_dir}/apn
  cat ${nv_path}/usb3g_user_${apn_active} > ${tmp_dir}/username
  cat ${nv_path}/usb3g_pass_${apn_active} > ${tmp_dir}/password
fi

echo 1 > ${tmp_dir}/authpref
echo "ip" > ${tmp_dir}/ip_pro

