!(function (window) {
    var GridStackBuilder = function (options) {
        this.default_options = {
            cell_height: 80,
            vertical_margin: 2
        };
        this.options = options || this.default_options;
        this.gridstack = $('.grid-stack').gridstack(this.options).data('gridstack');
        this.sequnceId = 1;
        this.serialized_data = [];
        this.types = ['bar', 'pie', 'column', 'line', 'spline', 'area', 'scatter']
    };
    GridStackBuilder.prototype.initData = function () {
        this.serialized_data = [{
            x: 0,
            y: 0,
            width: 4,
            height: 3
        }, {
            x: 4,
            y: 0,
            width: 4,
            height: 3
        }, {
            x: 8,
            y: 0,
            width: 4,
            height: 3
        }];
        return this
    };
    GridStackBuilder.prototype.loadGrid = function () {
        var self = this;
        var gridTempl = this.gridstack;
        gridTempl.remove_all();
        var items = GridStackUI.Utils.sort(this.serialized_data);
        _.each(items, function (node) {
            var template = self.genrateTemplate();
            gridTempl.add_widget($(template), node.x, node.y, node.width, node.height)
        }, this)
    };
    GridStackBuilder.prototype.saveGrid = function () {
        var self = this;
        var gridTempl = this.gridstack;
        this.serialized_data = _.map($('.grid-stack > .grid-stack-item:visible'), function (el) {
            el = $(el);
            var node = el.data('_gridstack_node');
            var nodeattr = el.find('.widget');
            return {
                id: nodeattr.data('id'),
                type: nodeattr.data('type'),
                x: node.x,
                y: node.y,
                width: node.width,
                height: node.height
            }
        }, this);
        console.log(this.serialized_data)
    };
    GridStackBuilder.prototype.addGridItem = function (type) {
        var self = this;
        var itemId = self.sequnceId++;
        var gridTempl = this.gridstack;
        var template = self.genrateTemplate(itemId, type);
        gridTempl.add_widget($(template), 0, 0, 4, 4, true);
        return 'modual_' + itemId
    };
    GridStackBuilder.prototype.clearGrid = function () {
        var self = this;
        var gridTempl = this.gridstack;
        gridTempl.remove_all()
    };
    GridStackBuilder.prototype.removeItem = function (el) {
        var self = this;
        var gridTempl = this.gridstack;
        gridTempl.remove_widget(el, true)
    };
    GridStackBuilder.prototype.genrateTemplate = function (itemId, type) {
        var self = this;
        var template = '<div><div class="widget grid-stack-item-content" data-id="' + itemId + '" data-type="' + type + '"><div class="widget-header"><div class="title"></div><span class="tools"><a href="javascript:void(0);" class="reset-btn" title="编辑数据"><span class="iconfont">&#xe638;</span></a><a href="javascript:void(0);" class="close-btn" title="关闭"><span class="iconfont">&#xe6ae;</span></a></span></div><div id="modual_' + itemId + '" class="widget-body" data-type="' + type + '"></div></div><div/>';
        return template
    };
    window.GridStackBuilder = GridStackBuilder
})(window);