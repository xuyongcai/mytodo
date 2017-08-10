/*
store.set('user', { name:'Marcus' });
store.set("gg",12312);
store.clearAll()*/

/*var arr=[1,23,4,5];
store.set("gg", arr);
store.clearAll()*/

var task_list=[];  //任务列表

var $add_task=$(".add-task");  //提交

init();  //初始化
console.log(task_list);

$add_task.on("submit",function(ev){
    ev.preventDefault(); //阻止默认事件
    //console.log(1)
    var obj={};
    obj.title=$add_task.find("input").eq(0).val();

    if (!obj.title) return;
    //console.log(obj)

    add_task(obj);
    create_html(); //生成thml
    $add_task.find("input").eq(0).val(null);  //清空
});

//
function  init() {
    task_list=store.get("gg") || [];
    create_html(); //生成thml
}

//把对像push数组里面
function add_task(obj) {
    task_list.push(obj);
    //console.log(task_list)
    //把数据存到浏览器
    store.set("gg",task_list);
}


//1.创建一个对像  push数组里面
//2.把数据存到浏览器
//3.把数据取出来

//生成hmtl
function create_html() {
    var $task_list=$(".task-list");
    $task_list.html(null); //清空
    for(var i=0; i<task_list.length; i++){
        var $item=bind_html(task_list[i],i);
        $task_list.prepend($item);
    }
    bind_delete();
    bind_detail();
}

//绑定html
function bind_html(data,index){
    var str='<li data-index = "'+index+'">'+
				'<input type="checkbox" class="ckd" />'+
				'<span>'+data.title+'</span>'+
				'<div class="operate">'+
					'<span class="delete">删除</span>'+
					'<span class="detail">详情</span>'+
				'</div>'+
			'</li>';
    return str;
}

//-------------------------删除----------------------------
//点击事件
function bind_delete(){
	$(".delete").click(function(){
		//获取index
		var index = $(this).parent().parent().data("index");
//		console.log(index);
		remove_tasl_list(index);
	})
}

//删除功能
function remove_tasl_list(index){
	var off = confirm("你确定要删除吗？");
	if(!off) return;
	task_list.splice(index,1);
	refresh_task_list();//更新
}

//更新本地存储
function refresh_task_list(){
	store.set("gg",task_list);
	create_html();
}

//--------------------------删除    end-------------------------

//--------------------------详情------------------------------

//点击事件
function bind_detail(){
	$(".detail").click(function(){
		var index =$(this).parent().parent().data("index")
		var obj = task_list[index];
		$(".task-list li div").remove(".detail-box");//关闭原来弹窗
		
		create_html();//更新数据列表
		create_detail_html(obj,index);//弹窗
    })
}
//创建DetailHtml
function create_detail_html(obj,index){
	var src = '<div class="detail-box">'+
					'<div class="close">X</div>'+
					'<h3 class="detail-title">'+obj.title+'</h3>'+
					'<input type="text" class="detail-title-hide"/>'+
					'<textarea class="detail-text">'+(obj.text || "")+'</textarea>'+
					'<span>提醒时间</span>'+
					'<input type="date" class="detail-time" value="'+(obj.time || "")+'">'+
					'<input type="button" class="refresh" value="更新" />'+
				'</div>';
				
	$(".task-list").find("li").eq(-(index+1)).append(src)
	close_detail();
	bind_up_data();
	dblclick_detail_title();
}
//关闭事件
function close_detail(){
	$(".close").click(function(){	
		$(this).parent().remove(".detail-box");
		create_html();//更新数据列表
	})
}
//数据保存
function bind_up_data(){
	$(".refresh").click(function(){	
		var index = $(this).parent().parent().data("index");
		var newobj = {};
		newobj.title = $(this).parent().find(".detail-title").text();
		newobj.text = $(this).parent().find(".detail-text").val();
		newobj.time = $(this).parent().find(".detail-time").val();	
		
		up_data(newobj,index);
		
	})
}

//更新本地数据
function up_data(newobj,index){
	task_list[index] = newobj;
	store.set("gg",task_list);
	create_detail_html(task_list[index]);
}

//双击改变标题
function dblclick_detail_title(){
	$(".detail-title").dblclick(function(){
		var $that = $(this);
		var $detail_title_hide = $(".box ul li .detail-box .detail-title-hide");
		$detail_title_hide.show();
		$that.hide();
		
		$detail_title_hide.focus().val($that.text());
		$detail_title_hide.on("blur",function(){
			$that.show();
            $(this).hide();
            if (!$(this).val()) return;
            $that.text($(this).val());
		})

	})
}

//--------------------------详情  end----------------------------

//--------------------------选择框--------------------------------











//--------------------------选择框  end------------------------------