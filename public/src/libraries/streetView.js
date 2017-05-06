'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactAsyncLoader = require('react-async-loader');

var _reactAsyncLoader2 = _interopRequireDefault(_reactAsyncLoader);

var ReactStreetview = (function (_React$Component) {
	_inherits(ReactStreetview, _React$Component);

	function ReactStreetview() {
		_classCallCheck(this, ReactStreetview);

		_get(Object.getPrototypeOf(ReactStreetview.prototype), 'constructor', this).call(this);
		this.streetView = null;
	}
    var update = (event, _this) =>
    {
        var i = i || 0;

        //tricky coeff checker depending on platform (i know that ternary sound odd, but u'll thank me when u'll need to change those values.)
        var coeff = .48;

        if (!event || event == 'position')
            _this.map.setCenter(_this.streetView.getPosition());

        if (!event || event == 'center')
        {

                var map    = _this.map.getDiv();
                console.log(map);

                var    matrix = (_this.map.drag.style.transform || 'matrix(1,0,0,1,0,0)').split(','),
                    center = {
                        width : map.clientWidth  * .5,
                        height: map.clientHeight * .5
                    },
                    drag   = {
                        left: parseInt(matrix[4]) || parseInt(_this.map.drag.style.left),
                        top : parseInt(matrix[5]) || parseInt(_this.map.drag.style.top)
                    },
                    marker = {
                        left: parseInt(_this.map.marker.parentNode.style.left) + $(_this.map.marker).width()  * .5,
                        top : parseInt(_this.map.marker.parentNode.style.top ) + $(_this.map.marker).height() * .75
                    },
                    width = _this.map.getDiv().parentNode.clientWidth || $(_this.config.map).width();
                    console.log(map);
                //offset since start
                marker.left += drag.left;
                marker.top  += drag.top;

                //distance from the center
                marker.left -= center.width;
                marker.top  -= center.height;

                //we put a coeff to decide either the pixel-measured length is inside or outside the radius.
                //as the map is giving approximations (pixels are flat, earth is not), SOME challenges are buggy.
                //only solution found at this point is playing with "coeff" value as per challenge basis to
                //adapt and correct

                /*console.log('===');
                console.log('width', width);
                console.log('coeff', coeff);*/

                var length = Math.sqrt(marker.left * marker.left + marker.top * marker.top);

                /*console.log('length', length);
                console.log('---');*/

                length = 0 + (length | 0);
                width  = 1 + (width  | 0);

                var perimeter = (width * coeff) | 0;
                    clname    = length > perimeter ? 'outside' : 'inside';

                //console.log(length, perimeter, length > perimeter, clname);

                _this.map.arrow.className = clname;
                _this.map.arrow.style.width = width + 'px';

        }

        if (!event || event == 'position' || event == 'pov')
        {
            console.log(_this.config.destination);

                var angle = _this.props.googleMaps.geometry.spherical.computeHeading(
                    {lat:function() {
                        return _this.config.destination.lat
                    },
                    lng:function () {
                        return _this.config.destination.lng
                    }}, _this.streetView.getPosition()
                );
                console.log(angle);
                _this.map.arrow.style.transform                  = ('rotate(%deg)').replace('%',  (angle + 90));
                _this.map.arrow.style.webkitTransform            = ('rotate(%deg)').replace('%',  (angle + 90));
                _this.map.arrow.style.mozTransform               = ('rotate(%deg)').replace('%',  (angle + 90));
                _this.map.arrow.style.msTransform                = ('rotate(%deg)').replace('%',  (angle + 90));

                _this.map.arrow.firstChild.style.transform       = ('rotate(%deg)').replace('%', -(angle + 90));
                _this.map.arrow.firstChild.style.webkitTransform = ('rotate(%deg)').replace('%', -(angle + 90));
                _this.map.arrow.firstChild.style.mozTransform    = ('rotate(%deg)').replace('%', -(angle + 90));
                _this.map.arrow.firstChild.style.msTransform     = ('rotate(%deg)').replace('%', -(angle + 90));

        }
    }
	_createClass(ReactStreetview, [{
		key: 'initialize',
		value: function initialize(canvas) {
			var _this = this;

			if (this.props.googleMaps && this.streetView == null) {
				this.streetView = new this.props.googleMaps.StreetViewPanorama(canvas, this.props.streetViewPanoramaOptions);
				var panoramaService = new this.props.googleMaps.StreetViewService();
                var map_container = document.getElementById('main');
                var self = _this;
                var config = {};
                if (!config.map)
                    config.map = { zoom: 15 };

                var defaults =
                {
                        mapTypeControl: false,
                        addressControl: false,
                        linksControl: false,
                        zoomControl: false,
                        draggable:false
                };
               for (var key in defaults)
                config.map[key] = defaults[key];
                var obj = document.createElement('div');
                obj.style.cssText = 'width:100;height:60;';
                obj.setAttribute('id','map_last');

                self.map = new this.props.googleMaps.Map(
                    map_container.appendChild(obj),
                    config.map);

                self.api = new this.props.googleMaps.StreetViewService();
                self.config = {};
                var record = '';
                for(var i in this.props.panos) {
                    record= i;
                    break;
                }

                self.config = config;

                console.log(this.props.panos[record]);

                    self.config.destination = {lat:parseFloat(this.props.panos[record].lat),lng:parseFloat(this.props.panos[record].lng)};
                    console.log(self.config.destination);
                    window.marker = self.map.marker = new this.props.googleMaps.Marker(
                    {
                        map       : self.map,
                        position  : self.config.destination,
                        optimized : false,
                        icon      :
                        {
                            url    :  '/assets/img/img_flag.png',
                            size   : new google.maps.Size (25, 36),
                            origin : new google.maps.Point( 0,  0),
                            anchor : new google.maps.Point(12, 36)
                        }
                    });

                self.map.setStreetView(this.streetView);
                self.map.setCenter(this.streetView.getPosition());
                var _this = this;
                self.map.arrow = document.getElementById('map_last').appendChild(
                    document.createElement('span')
                );

                self.map.arrow.appendChild(
                    document.createElement('span')
                );
                self.map.drag = document.querySelector('img[src*="img_flag.png"]');
                console.log(self.map.drag);
                var marker = document.querySelector('img[src*="img_flag.png"]');
                self.map.marker = marker;

                //var _this = this;
				this.streetView.addListener('position_changed', function () {
                    update('position',_this);
                    self.map.setCenter(_this.streetView.getPosition());
					if (_this.props.onPositionChanged) {
						_this.props.onPositionChanged(_this.streetView.getPosition());
					}
				});




                this.streetView.addListener('pano_changed', function () {
                    update('center',_this);
                    self.map.setCenter(_this.streetView.getPosition());
					if (_this.props.onPositionChanged) {
						_this.props.onPanoChanged(_this.streetView.getPano());
					}
				});

				this.streetView.addListener('pov_changed', function () {
                    update('pov',_this);
                    self.map.setCenter(_this.streetView.getPosition());
					if (_this.props.onPovChanged) {
						_this.props.onPovChanged(_this.streetView.getPov());
						panoramaService.getPanoramaByLocation(_this.streetView.getPosition(), 100, function (streetViewPanoramaData, streetViewStatus) {
							if (streetViewStatus == "OK") {																				_this.props.onLocationChanged(streetViewPanoramaData);
							}
						});
					}
				});
			}
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.initialize(_reactDom2['default'].findDOMNode(this));
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate() {
			this.initialize(_reactDom2['default'].findDOMNode(this));
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			if (this.streetView) {
				this.props.googleMaps.event.clearInstanceListeners(this.streetView);
			}
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2['default'].createElement('div', {
				style: {
					height: '100%'
				}
			});
		}
	}]);

	return ReactStreetview;
})(_react2['default'].Component);

ReactStreetview.propTypes = {
	apiKey: _react2['default'].PropTypes.string.isRequired,
    panos: _react2['default'].PropTypes.array,
	streetViewPanoramaOptions: _react2['default'].PropTypes.object.isRequired,
	onPositionChanged: _react2['default'].PropTypes.func,
	onPovChanged: _react2['default'].PropTypes.func,
	onPositionChanged: _react2['default'].PropTypes.func,
    onPanoChanged: _react2['default'].PropTypes.func
};

ReactStreetview.defaultProps = {
	streetViewPanoramaOptions: {
		position: { lat: 46.9171876, lng: 17.8951832 },
		pov: { heading: 0, pitch: 0 },
		zoom: 1
	}
};

function mapScriptsToProps(props) {
	var googleMapsApiKey = props.apiKey;
    var record = 'asdasd';
    var j = 0
	return {
		googleMaps: {
			globalPath: 'google.maps',
			url: 'https://maps.googleapis.com/maps/api/js?key=' + googleMapsApiKey,
			jsonp: true
		}
	};
}

exports['default'] = (0, _reactAsyncLoader2['default'])(mapScriptsToProps)(ReactStreetview);
module.exports = exports['default'];
