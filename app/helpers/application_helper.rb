module ApplicationHelper
	def javascript_globals(map)
		return unless map
		javascript_tag do
			map.each do |var, val|
				concat "var #{var} = #{val.to_json}".html_safe
			end
		end
	end
end
