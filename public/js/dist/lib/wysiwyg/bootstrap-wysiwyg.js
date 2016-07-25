/* http://github.com/mindmup/bootstrap-wysiwyg */
/*global jQuery, $, FileReader*/
/*jslint browser:true*/
(function($) {
	'use strict';
	//将文件读取为DateURL
	var readFileIntoDataUrl = function(fileInfo) {
		//执行状态------dtd.resolve()--已完成---回调done();dtd.reject()---已失败----回调---fail();----deferred.promise()---返回另一个对象
		var loader = $.Deferred(),
		    //文件读取
			fReader = new FileReader();
		//成功读取
		fReader.onload = function(e) { 
			//读取成功回调result
			loader.resolve(e.target.result);
		};
		//读取失败回调
		fReader.onerror = loader.reject;
		//正在读取-------根据给定的 args参数 调用Deferred（延迟）对象上进行中的回调 （progressCallbacks）
		fReader.onprogress = loader.notify;
		//将文件读取为DataURL
		fReader.readAsDataURL(fileInfo);
		//返回promise对象
		return loader.promise();
	};
	/*清除html*/
	$.fn.cleanHtml = function() {
		var html = $(this).html();
		return html && html.replace(/(<br>|\s|<div><br><\/div>|&nbsp;)*$/, '');
	};
	/*init*/
	$.fn.wysiwyg = function(userOptions) {
		//编辑框
		var editor = this,
		//选择
			selectedRange,
		//选项
			options,
		//顶部btn选择器
			toolbarBtnSelector,
			/*获取焦点更新样式*/
			updateToolbar = function() {
				//
				if (options.activeToolbarClass) {
					$(options.toolbarSelector).find(toolbarBtnSelector).each(function() {
						var command = $(this).data(options.commandRole);
						//返回命令的操作状态----toolbar初始化
						if (document.queryCommandState(command)) {
							$(this).addClass(options.activeToolbarClass);
						} else {
							$(this).removeClass(options.activeToolbarClass);
						}
					});
				}
			},
			/*执行命令*/
			execCommand = function(commandWithArgs, valueArg) {
				var commandArr = commandWithArgs.split(' '),//以空格截取
					command = commandArr.shift(),//shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。
					args = commandArr.join(' ') + (valueArg || '');//命令加上参数使用空格隔开  取出数组中的数据默认以,号隔开,可以传递其它符号代替join('=')
                //document.execCommand(sCommand,交互方式, 动态参数)//selectAll(全选)-open(打开)-saveAs(另存)-print(打印)
                //执行一些操作命令
				document.execCommand(command, 0, args);
				//更新工具栏
				updateToolbar();
			},
			/*绑定热键*/
			bindHotkeys = function(hotKeys) {
				$.each(hotKeys, function(hotkey, command) {
					editor.keydown(hotkey, function(e) {
						if (editor.attr('contenteditable') && editor.is(':visible')) {
							//该方法将通知 Web 浏览器不要执行与事件关联的默认动作
							e.preventDefault();
							//阻止事件传递
							e.stopPropagation();
							//执行命令
							execCommand(command);
						}
					}).keyup(hotkey, function(e) {
						if (editor.attr('contenteditable') && editor.is(':visible')) {
							e.preventDefault();
							//阻止事件传递
							e.stopPropagation();
						}
					});
				});
			},
			/*非IE浏览器*/ //获取当前选中区域
			getCurrentRange = function() {
				//selection是对当前激活选中区（即高亮文本）进行操作
				var sel = window.getSelection();
				//从当前selection对象中获得一个range对象。根据下标index返回相应的range对象。
				//返回selection中包含的range对象的数目，一般存在一个range，Ctrl健配合使用可以有多个。
				if (sel.getRangeAt && sel.rangeCount) {
					return sel.getRangeAt(0);
				}
			},
			/*保存选择*/
			saveSelection = function() {
				selectedRange = getCurrentRange();
			},
			/*恢复选择*/
			restoreSelection = function() {
				var selection = window.getSelection();
				if (selectedRange) {
					try {
						selection.removeAllRanges();
					} catch (ex) {
						document.body.createTextRange().select();
						document.selection.empty();
					}
					selection.addRange(selectedRange);
				}
			},
			/*插入图片*/
			insertFiles = function(files) {
				//编辑框获取焦点
				editor.focus();
                //遍历文件
				$.each(files, function(idx, fileInfo) {
					
					if (/^image\//.test(fileInfo.type)) {
						//插入图片的时候    插入图片成功回调
						$.when(readFileIntoDataUrl(fileInfo)).done(function(dataUrl) {
							//成功回调dataurl
							execCommand('insertimage', dataUrl);
						}).fail(function(e) {
							//文件读取失败
							options.fileUploadError("file-reader", e);
						});
					} else {
                        //不支持文件格式
						options.fileUploadError("unsupported-file-type", fileInfo.type);
					}
				});
			},
			/*标记选中区域*/
			markSelection = function(input, color) {
				restoreSelection();
				if (document.queryCommandSupported('hiliteColor')) {
					document.execCommand('hiliteColor', 0, color || 'transparent');
				}
				saveSelection();
				input.data(options.selectionMarker, color);
			},
			/*绑定工具栏点击事件*/
			bindToolbar = function(toolbar, options) {
				toolbar.find(toolbarBtnSelector).click(function() {
					restoreSelection();
					editor.focus();
					execCommand($(this).data(options.commandRole));
					saveSelection();
				});
				toolbar.find('[data-toggle=dropdown]').click(restoreSelection);
                //input绑定点击事件
				toolbar.find('input[type=text][data-' + options.commandRole + ']').on('webkitspeechchange change', function() {
					var newValue = this.value; /* ugly but prevents fake double-calls due to selection restoration */
					this.value = '';
					restoreSelection();
					if (newValue) {
						editor.focus();
						execCommand($(this).data(options.commandRole), newValue);
					}
					saveSelection();
				}).on('focus', function() { 
					var input = $(this);
					if (!input.data(options.selectionMarker)) {
						markSelection(input, options.selectionColor);
						input.focus();
					}
				}).on('blur', function() {
					var input = $(this);
					if (input.data(options.selectionMarker)) {
						markSelection(input, false);
					}
				});
				//上传图片
				toolbar.find('[type=file][data-' + options.commandRole + ']').change(function(event) {
					//reset选中区域
					restoreSelection();
					if (this.type === 'file' && this.files && this.files.length > 0) {
						//插入文件
						if ($(this).attr('data-edit')=='insertImage') {
						    insertFiles(this.files);
						}else{
                            $(this).trigger("fileUpload",options);
						}
			    }
					//保存选中区域
					saveSelection();
					//设置默认值为空
					this.value = '';
				});
			},
			/*初始化文件拖拽*/
			initFileDrops = function() {
				//绑定
				editor.on('dragenter dragover', false)
					  //拖拽完成回调
					  .on('drop', function(e) {
						var dataTransfer = e.originalEvent.dataTransfer;
						//阻止冒泡
						e.stopPropagation();
						//阻止a标签的默认行为
						e.preventDefault();
						//判断数据长度
						if (dataTransfer && dataTransfer.files && dataTransfer.files.length > 0) {
							//插入文件
							insertFiles(dataTransfer.files);
						}
					});
			},
			//默认值热键、class、错误信息
			options = $.extend({}, $.fn.wysiwyg.defaults, userOptions);
		//工具栏选择器
		toolbarBtnSelector = 'a[data-' + options.commandRole + '],button[data-' + options.commandRole + '],input[type=button][data-' + options.commandRole + ']';
		//绑定热键
		bindHotkeys(options.hotKeys);
		//判断是否可以拖拽文件
		if (options.dragAndDropImages) {
			//初始化文件拖拽
			initFileDrops();
		}
		//绑定工具栏事件
		bindToolbar($(options.toolbarSelector), options);
		//添加attribute  绑定鼠标抬起，键盘抬起，鼠标移出
		editor.attr('contenteditable', true)
			.on('mouseup keyup mouseout', function() {
				saveSelection();
				updateToolbar();
			});
		//绑定一个触摸事件
		$(window).bind('touchend', function(e) {
			var isInside = (editor.is(e.target) || editor.has(e.target).length > 0),
				currentRange = getCurrentRange(),
				clear = currentRange && (currentRange.startContainer === currentRange.endContainer && currentRange.startOffset === currentRange.endOffset);
			if (!clear || isInside) {
				saveSelection();
				updateToolbar();
			}
		});
		return this;
	};
	$.fn.initRichTextBox = function() {
		var fonts = ['Serif', 'Sans', 'Arial', 'Arial Black', 'Courier', 'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande', 'Lucida Sans', 'Tahoma', 'Times', 'Times New Roman', 'Verdana'],
			fontTarget = $('[title=字体]').siblings('.dropdown-menu');
		$.each(fonts, function(idx, fontName) {
			fontTarget.append($('<li><a data-edit="fontName ' + fontName + '" style="font-family:\'' + fontName + '\',text-shadow:0;">' + fontName + '</a></li>'));
		});
		$('a[title]').tooltip({
			container: 'body'
		});
		//超链接
		$('.dropdown-menu input').click(function() {
				return false;
			})
			.change(function() {
				$(this).parent('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle');
			})
			.keydown('esc', function() {
				this.value = '';
				$(this).change();
			});
		//设置input覆盖样式
		$('[data-role=magic-overlay]').each(function() {
			var overlay = $(this),
				//相对元素
				target = $(overlay.data('target'));
			//覆盖样式-----position:absolute;opcity:0;offset:targetOffset
			overlay.css('opacity', 0).css('position', 'absolute').offset(target.offset()).width(target.outerWidth()).height(target.outerHeight());
		});
		if ("onwebkitspeechchange" in document.createElement("input")) {
			var editorOffset = $('.editor').offset();
			$('.voiceBtn').css('position', 'absolute').offset({
				top: editorOffset.top,
				left: editorOffset.left + $('#editor').innerWidth() - 35
			});
		} else {
			$('.voiceBtn').hide();
		}
		//初始化editor
		$('#editor').wysiwyg({
			fileUploadError: showErrorAlert
		});
		$('.editor').wysiwyg({
			fileUploadError: showErrorAlert
		});
		//错误提示
		function showErrorAlert(reason, detail) {
			var msg = '';
			if (reason === 'unsupported-file-type') {
				msg = "不支持此格式 " + detail;
			} else {
				console.log("上传文件失败！", reason, detail);
			}
			$('<div class="alert"> <button type="button" class="close" data-dismiss="alert">&times;</button>' +
				'<strong style="color:#AF2F2F;">上传文件失败！格式不正确！</strong></div>').prependTo('#alerts');
		};
	};
	$.fn.wysiwyg.defaults = {
		hotKeys: {
			'ctrl+b meta+b': 'bold',
			'ctrl+i meta+i': 'italic',
			'ctrl+u meta+u': 'underline',
			'ctrl+z meta+z': 'undo',
			'ctrl+y meta+y meta+shift+z': 'redo',
			'ctrl+l meta+l': 'justifyleft',
			'ctrl+r meta+r': 'justifyright',
			'ctrl+e meta+e': 'justifycenter',
			'ctrl+j meta+j': 'justifyfull',
			'shift+tab': 'outdent',
			'tab': 'indent'
		},
		toolbarSelector: '[data-role=editor-toolbar]',
		commandRole: 'edit',
		activeToolbarClass: 'btn-info',
		selectionMarker: 'edit-focus-marker',
		selectionColor: 'darkgrey',
		dragAndDropImages: true,
		fileUploadError: function(reason, detail) {
			console.log("File upload error", reason, detail);
		}
	};
}(window.jQuery));