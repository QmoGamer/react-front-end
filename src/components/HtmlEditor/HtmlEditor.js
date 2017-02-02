import React from 'react'
import TinyMCE from 'react-tinymce'

export default class HtmlEditor extends React.Component {

	constructor (props) {
    super(props)
  }

  render () {

  		const { content_value, handleEditorChange } = this.props

			return (
				<div>
					<TinyMCE
            content={ content_value }
            config={{
              menubar: false,
              plugins: [
                'link image textcolor lists preview autoresize nonbreaking'
              ],
              autoresize_bottom_margin: 0,
              autoresize_min_height: 300,
              entity_encoding: 'raw',
              toolbar: '| formatselect | fontsizeselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist forecolor backcolor | link unlink preview'
            }}
            onChange={ handleEditorChange }
          />
				</div>
			)
	 }
}
