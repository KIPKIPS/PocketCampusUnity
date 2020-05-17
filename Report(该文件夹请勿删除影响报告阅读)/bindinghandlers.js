ko.bindingHandlers.graphPie1 = {
    update: function (elem, valueAccessor) {
        var currentValue = ko.utils.unwrapObservable(valueAccessor());

        var chart = echarts.init(elem);
        chart.setOption({
            //tooltip: {
            //    trigger: 'item',
            //    formatter: "{a} <br/>{b}: {c} ({d}%)"
            //},
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: ['65%', '100%'],
                    hoverAnimation: false,
                    label: {
                        normal: {
                            show: true,
                            position: 'center',
                            textStyle: {
                                fontSize: '20',
                                fontWeight: 'bold',
                            }
                        }
                        //,
                        //emphasis: {
                        //    show: true,
                        //    textStyle: {
                        //        fontSize: '30',
                        //        fontWeight: 'bold'
                        //    }
                        //}
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [
                        {
                            value: currentValue,
                            name: currentValue + '%',
                            itemStyle: {
                                normal: {
                                    color: '#26B1C1'
                                }
                            }
                        },
                        {
                            value: (100 - currentValue),
                            name: '',
                            itemStyle: {
                                normal: {
                                    color: '#9FEAF3'
                                }
                            }
                        }
                    ]
                }
            ]
        });
    }
};

ko.bindingHandlers.numeral = {
    update: function (elem, valueAccessor) {

        var currentValue = ko.utils.unwrapObservable(valueAccessor());
        if (typeof (currentValue) != 'object') {
            currentValue = { value: currentValue, format: '0,0' };
        }

        var formattedValue = numeral(currentValue.value).format(currentValue.format);
        $(elem).text(formattedValue);
    }
};

ko.components.register('graph-bar', {
    viewModel: { require: app.root + 'component-graph-bar.js' },
    template: { element: 'asdfasdf' }
});

ko.components.register('graph-bar2', {
    viewModel: { require: app.root + 'component-graph-bar.js' },
    template: { element: 'asdfasdf' }
});

ko.components.register('bubble-cloud', {
    viewModel: { require: app.root + 'component-bubble-cloud.js' },
    template: { require: 'text!' + app.root + 'component-bubble-cloud.html' }
});

//ko.components.register('rose-pie', {
//    viewModel: { require: app.root + 'Scripts/app/components/component-rose-pie.js' },
//    template: { require: 'text!' + app.root + 'Scripts/app/components/component-rose-pie.html' }
//});

ko.components.register('rose-pie', {
    viewModel: function (params) {
        var self = this;
        var color = ['#399cc3', '#ffb82a', '#3fcbdb', '#ff7373', '#d286de', '#26b1c1', '#7cd6a9', '#f9cc71'];
        var fontSize = [25, 22, 20, 18, 17, 15, 13, 12];
        var valueArray = [45,40,35,32.5,30,25,20,15]

        var data = _.map(_.first(params.value(), 8), function (item, index) {
            return {
                name: (item.copyPercent * 100).toFixed(2) + '%',
                value: valueArray[index], //item.copyPercent * 100,
                data: item,
                label: {
                    normal: {
                        textStyle: {
                            fontSize: fontSize[index],
                            fontWeight: 'bold'
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        color: color[index],
                        shadowBlur: 10,
                        shadowColor: 'gray',
                        shadowOffsetX: 3,
                        shadowOffsetY: 3
                    }
                }
            }
        });

        // 属性
        self.isSelect = ko.observable(false),
        self.copyPercent = ko.observable(),
        self.title = ko.observable(),
        self.author = ko.observable(),
        self.isReference = ko.observable(),
        self.textClass = ko.observable(),
        self.option = {
            calculable: true,
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: [50, 170],
                    roseType: 'radius',
                    startAngle: '45',
                    center: ['50%', '50%'],
                    clockwise: false,
                    label: {
                        normal: {
                            show: true,
                            position: 'inside'
                        }
                    },
                    data: data
                }
            ]
        };

        // 方法
        self.init = function () {
            var ele = $('#' + params.id + ' .rosePieChart')[0];
            var chart = echarts.init(ele);
            chart.setOption(self.option);

            chart.on('mouseover', function (params) {
                var item = params.data.data;

                var textClass = 'text-others';
                if (item.isPublishedSelfCited) {
                    textClass = 'text-published';
                }
                else if (item.isUnPublishedSelfCited) {
                    textClass = 'text-degree';
                }
                else if (item.isReference) {
                    textClass = 'text-reference';
                }

                self.copyPercent((item.copyPercent * 100).toFixed('2') + '%');
                self.title(item.title[0]);
                self.author(item.creator[0]);
                self.isReference(item.isReference ? '是' : '否');
                self.textClass(textClass);

                var hasBanquan = true;
                var hasBanquanKV = _.find(item.dataBaseInfoMap, function (item) { return item.key == '有无版权' });
                if (!hasBanquanKV || hasBanquanKV.value != "1") {
                    hasBanquan = false;
                }

                if (!hasBanquan) {
                    self.textClass('text-nocopyright');
                }

                self.isSelect(true);

                //console.log(params.data.data);
            });
        }

        self.init();

    },
    template: { require: 'text!' + app.root + 'Scripts/app/components/component-rose-pie.html' }
});

ko.components.register('copypercent-ring', {
    viewModel: { require: app.root + 'Scripts/app/components/component-copypercent-ring.js' },
    template: { require: 'text!' + app.root + 'Scripts/app/components/component-copypercent-ring.html' }
});

ko.components.register('like-widget', {
    viewModel: { require: app.root + 'Scripts/app/components/component-like-widget.js' },
    template: { require: 'text!' + app.root + 'Scripts/app/components/component-like-widget.html' }
});

//ko.components.register('like-widget', {
//    viewModel: function (params) {
//        // Data: value is either null, 'like', or 'dislike'
//        this.chosenValue = params.value;

//        // Behaviors
//        this.like = function () { this.chosenValue('like'); }.bind(this);
//        this.dislike = function () { this.chosenValue('dislike'); }.bind(this);
//    },
//    template:
//        '<div class="like-or-dislike" data-bind="visible: !chosenValue()">\
//            <button data-bind="click: like">Like it</button>\
//            <button data-bind="click: dislike">Dislike it</button>\
//        </div>\
//        <div class="result" data-bind="visible: chosenValue">\
//            You <strong data-bind="text: chosenValue"></strong> it\
//        </div>'
//});