/**
* @description     表格排序实现
* @author          Blog:http://www.cnblogs.com/know/
* @date            2011-10-28
* @modify date     2012-12-08
* @modify description     修改了对汉字排序有误的问题，可以实现字母汉字混排(其实现是：将汉字转换为全拼，统一按字母排序)
**/
(function () {
    //#region 全局变量
    //初始化配置对象
    var _initConfig = null;
    var _tableObj = null, _tbodyObj = null, _tBodyIndex = 0;
    //存放当前各排序方式下的(有序)行数组的对象——仅在IsLazyMode=true，此变量有用
    var _trJqObjArray_Obj = null;
    //#endregion

    //#region 内部方法
    /**
    * 获得排序列值数组的方法
    * @private
    * @param trJqObjArr：(外部传入)存放排序行的数组，tdIndex：排序列的索引，td_valAttr：排序列的取值属性，td_dataType：排序列的值类型
    **/
    function GetOrderTdValueArray(trJqObjArr, tdIndex, td_valAttr, td_dataType) {
        var tdOrderValArr = new Array();
        var trObj, tdObj, tdVal;
        _tbodyObj.find("tr").each(function (trIndex, trItem) {
            trObj = $(trItem);
            trJqObjArr.push(trObj);

            tdObj = trObj.find("td")[tdIndex];
            tdObj = $(tdObj);
            tdVal = td_valAttr ? tdObj.attr(td_valAttr) : tdObj.text();
            tdVal = GetValue(tdVal, td_dataType);
            tdOrderValArr.push(tdVal);
        });
        return tdOrderValArr;
    }

    /**
    * 返回jQuery对象的方法
    * @private
    **/
    function GetJqObj(id) {
        return "string" == typeof (id) ? $("#" + id) : $(id);
    };

    /**
    * 排序方法
    * @private
    * @param tdIndex：排序列的索引,options：排序列的规则配置对象
    **/
    function Sort(tdIndex, options) {
        var trJqObjArr = null;
        if (_initConfig.IsLazyMode) {
            !_trJqObjArray_Obj && (_trJqObjArray_Obj = {});
            trJqObjArr = _trJqObjArray_Obj[tdIndex];
        }
        var isExist_trJqObjArr = true;
        if (!trJqObjArr) {
            isExist_trJqObjArr = false;
            trJqObjArr = new Array();
            var tdOrderValArr = GetOrderTdValueArray(trJqObjArr, tdIndex, options.ValAttr, options.DataType);
            var sort_len = tdOrderValArr.length - 1;
            var isExchanged = false, compareRes;
            for (var i = 0; i < sort_len; i++) {
                isExchanged = false;
                for (var j = sort_len; j > i; j--) {
                    compareRes = options.Desc ? (tdOrderValArr[j] > tdOrderValArr[j - 1]) : (tdOrderValArr[j] < tdOrderValArr[j - 1]);
                    if (compareRes) {
                        ExchangeArray(tdOrderValArr, j);
                        //交换行对象在数组中的顺序
                        ExchangeArray(trJqObjArr, j);
                        isExchanged = true;
                    }
                }
                //一遍比较过后如果没有进行交换则退出循环 
                if (!isExchanged)
                    break;
            }
            _initConfig.IsLazyMode && (_trJqObjArray_Obj[tdIndex] = trJqObjArr);
        }

        if (trJqObjArr) {
            if (options.Toggle) {
                _initConfig.IsLazyMode && isExist_trJqObjArr && trJqObjArr.reverse();
                options.Desc = !options.Desc;
            }
            ShowTable(trJqObjArr);
        }
    }

    /**
    * 显示排序后的表格
    * @private
    * @param trJqObjArr：排序后的tr对象数组
    **/
    function ShowTable(trJqObjArr) {
        for (var n = 0, len = trJqObjArr.length; n < len; n++) {
            _tbodyObj.append(trJqObjArr[n]);
            $.isFunction(_initConfig.OnShow) && (_initConfig.OnShow(n, trJqObjArr[n], _tbodyObj));
        }
    }

    /**
    * 交换数组中项的方法
    * @private
    * @param array：数组，j：交换数组项的尾项索引
    **/
    function ExchangeArray(array, j) {
        var temp = array[j];
        array[j] = array[j - 1];
        array[j - 1] = temp;
    }

    /**
    * 添加排序方式(规则)的方法
    * @private
    * @param tdVal：排序列的值，td_dataType：排序列的值类型
    **/
    function GetValue(tdVal, td_dataType) {
        switch (td_dataType) {
            case "int":
                return parseInt(tdVal) || 0;
            case "float":
                return parseFloat(tdVal) || 0;
            case "date":
                var date=tdVal.substr(0,4)+tdVal.substr(5,2)+tdVal.substr(8,2)+tdVal.substr(11,2)+tdVal.substr(14,2);
                return parseInt(date) || 0;
            case "size":
                var size=tdVal.split('B');
                return parseInt(size[1]) || 0;
            case "string":
            default:
                {
                    var tdVal = tdVal.toString() || "";
                    //如果值不为空，获得值是汉字的全拼
//                    if (tdVal) {
//                        tdVal = ZhCN_Pinyin.GetQP(tdVal);
                        tdVal = tdVal.toLowerCase();
//                    }
                    return tdVal;
                }
        }
    }

    /**
    * 添加排序方式(规则)项的方法
    * @private
    * @param obj：排序触发(标签)的对象或id，index：要排序列所在的列索引，options：排序规则设置对象(如:DataType...)
    **/
    function SetOrderItem(obj, index, options) {
        var orderSettings = {
            ValAttr: false, //排序列的取值属性,默认为：innerText
            DataType: "string", //排序列的值类型(可取值：int|float|date|string)
            OnClick: null, //(点击)排序时触发的方法
            Desc: false, //(是否是降序)排序方式，默认为：降序
            Toggle: true, //切换排序方式
            DefaultOrder: false //是否是默认的排序方式
        };
        $.extend(orderSettings, options);
        orderSettings.DataType = orderSettings.DataType.toLowerCase();
        obj = GetJqObj(obj);
        //绑定触发排序的事件
        obj.bind("click", function () {
            Sort(index, orderSettings);
            if(orderSettings.Desc) this.className='up';
            else this.className='down';
            $.isFunction(orderSettings.OnClick) && orderSettings.OnClick();
        });
        orderSettings.DefaultOrder && Sort(index, orderSettings);
//        if(orderSettings.DefaultOrder) obj[0].className='down';
    }
    //#endregion

    //#region 对外公开
    var _api = {
        Init: function (obj, tBodyIndex, options) {
            /// <summary>初始化方法</summary>
            /// <param name="obj" type="Object">要排序table的id或对象</param>
            /// <param name="tBodyIndex" type="int">要排序的数据行所在的tbody标签的索引</param>
            /// <param name="options" type="Object">初始化配置对象,{IsLazyMode:是否是懒惰模式,OnShow: 排序后表格显示时的方法}</param>
            if (obj == null || typeof (obj) == undefined) {
                alert("TableOrder初始化参数为空或有误！");
                return;
            }
//            if (typeof (ZhCN_Pinyin) == undefined) {
//                alert("获得汉字首拼的'ZhCN_Pinyin'对象不存在！");
//                return;
//            }
            _tableObj = GetJqObj(obj);
            _tBodyIndex = tBodyIndex || 0;
            _tbodyObj = _tableObj.find("tbody:eq(" + _tBodyIndex + ")");
            options = options || {};
            _initConfig = {
                IsLazyMode: true, //是否是懒惰模式，默认为:true
                OnShow: null  //排序后表格显示时的方法,params:trIndex,trJqObj,tbodyObj
            };
            $.extend(_initConfig, options);
            _trJqObjArray_Obj = null;
        },
        SetOrder: function (obj, index, options) {
            /// <summary>设置排序规则的方法</summary>
            /// <param name="obj" type="Object">排序触发(标签)的对象或id</param>
            /// <param name="index" type="int">要排序列所在的列索引</param>
            /// <param name="options" type="Object">排序规则设置对象(如:DataType...)</param>
            if (_tableObj == null) {
                alert("_tableObj尚未初始化！");
                return;
            }
            SetOrderItem(obj, index, options);
        }
    };
    window.TableOrderOper = _api;
    //#endregion
})();