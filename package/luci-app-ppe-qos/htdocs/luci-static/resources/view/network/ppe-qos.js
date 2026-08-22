'use strict';
'require view';
'require form';

return view.extend({
	render: function() {
		var m, s, o;

		m = new form.Map('ppe-qos', _('PPE Hardware QoS'),
			_('Classifiers that pick a hardware egress queue in the switch. ' +
			  'Traffic in a higher-priority queue is served past the bulk queue of a shaped port, ' +
			  'so it keeps idle latency while the bulk queue runs deep enough for full throughput. ' +
			  'Shaper rates and the bulk queue depth belong to SQM (hw_ppe.qos).'));

		s = m.section(form.NamedSection, 'global', 'global', _('Small packets'));

		o = s.option(form.Value, 'small_packet_len', _('Maximum L3 length'),
			_('Frames up to this IP length are classified into the priority below, ' +
			  'regardless of any marking: ACKs, handshakes, DNS, VoIP and game traffic ' +
			  'jump the bulk queue. 0 disables.'));
		o.datatype = 'range(0,1500)';
		o.placeholder = '128';

		o = s.option(form.ListValue, 'small_packet_prio', _('Priority'));
		for (var i = 0; i <= 7; i++)
			o.value(i, _('Priority %d').format(i));
		o.default = '5';

		s = m.section(form.GridSection, 'dscp', _('DSCP to priority'),
			_('Marked traffic classified on ingress of every switch port. ' +
			  'Applied via dcb app; higher priority wins the egress scheduler.'));
		s.addremove = true;
		s.anonymous = true;

		o = s.option(form.Value, 'dscp', _('DSCP'));
		o.datatype = 'range(0,63)';
		o.rmempty = false;
		o.value('46', _('46 (EF - voice)'));
		o.value('40', _('40 (CS5)'));
		o.value('34', _('34 (AF41 - video)'));
		o.value('48', _('48 (CS6 - control)'));

		o = s.option(form.ListValue, 'prio', _('Priority'));
		for (var j = 0; j <= 7; j++)
			o.value(j, _('Priority %d').format(j));
		o.rmempty = false;

		return m.render();
	}
});
