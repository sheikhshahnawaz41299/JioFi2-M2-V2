#!/bin/sh
# Copyright (c) 2014, The Linux Foundation. All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are
# met:
#     * Redistributions of source code must retain the above copyright
#       notice, this list of conditions and the following disclaimer.
#     * Redistributions in binary form must reproduce the above
#       copyright notice, this list of conditions and the following
#       disclaimer in the documentation and/or other materials provided
#       with the distribution.
#     * Neither the name of The Linux Foundation nor the names of its
#       contributors may be used to endorse or promote products derived
#       from this software without specific prior written permission.
#
# THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESS OR IMPLIED
# WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT
# ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS
# BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
# CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
# SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
# BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
# WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
# OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN
# IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
#
# find_partitions        init.d script to dynamically find partitions
#

FindAndMountUBI () {
   partition=$1
   dir=$2

   mtd_block_number=`cat $mtd_file | grep -i $partition | sed 's/^mtd//' | awk -F ':' '{print $1}'`
   echo "MTD : Detected block device : $dir for $partition"
   mkdir -p $dir

   ubiattach -m $mtd_block_number -d 1 /dev/ubi_ctrl
   device=/dev/ubi1_0
   while [ 1 ]
    do
        if [ -c $device ]
        then
            mount -t ubifs /dev/ubi1_0 $dir -o bulk_read
            break
        else
            sleep 0.010
        fi
    done
}

#FindAndMountAppUBI () {
#   partition=$1
#   dir=$2
#
#   mtd_block_number=`cat $mtd_file | grep -i $partition | sed 's/^mtd//' | awk -F ':' '{print $1}'`
#   echo "MTD : Detected block device : $dir for $partition"
#   mkdir -p $dir
#
#   ubiattach -m $mtd_block_number -d 2 /dev/ubi_ctrl
#   device=/dev/ubi2_0
#   while [ 1 ]
#    do
#        if [ -c $device ]
#        then
#            mount -t ubifs /dev/ubi2_0 $dir -o bulk_read
#            break
#        else
#            sleep 0.010
#        fi
#    done
#}

FindAndMountVolumeUBI () {
   volume_name=$1
   dir=$2
   if [ ! -d $dir ]
   then
       mkdir -p $dir
   fi
   mount -t ubifs ubi0:$volume_name $dir -o bulk_read
}

ActionForOTA()
{
	mkdir /cache
#cachfs_id=`ubinfo /dev/ubi0 -N cachefs | grep -i volume | sed 's/^Volume ID:   //' | awk -F ' ' '{print $1}'`
	mount -t ubifs -o sync /dev/ubi0_2 /cache 

	if [ -f /cache/recovery/install_next_boot.sh ]; then
		mkdir /cache/log
		chmod +x /cache/recovery/install_next_boot.sh
		/cache/recovery/install_next_boot.sh > /cache/log/install_next_boot.log 2>&1
		rm /cache/recovery/install_next_boot.sh
	fi
}

mtd_file=/proc/mtd


fstype="UBI"
<<!
eval FindAndMountVolume${fstype} usrfs /data

ActionForOTA
!

OTA_STRING=`/app/bin/ota_pioneer -k`
TAR_MODEM=${OTA_STRING:2:1}
echo "init TAR_MODEM is $TAR_MODEM"
MODEM_PARTI=modem
if [ $TAR_MODEM -ne 0 ]; then
	MODEM_PARTI=modm2
fi
eval FindAndMount${fstype} $MODEM_PARTI /firmware

#eval FindAndMountAppUBI app /app

exit 0
