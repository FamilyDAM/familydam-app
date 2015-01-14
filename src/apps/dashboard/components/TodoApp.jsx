/** @jsx React.DOM */
// Renders the full application
// activeRouteHandler will always be TodoMain, but with different 'showing' prop (all/completed/active)

    var TodoApp = React.createClass({
        // this will cause setState({list:updatedlist}) whenever the store does trigger(updatedlist)
        mixins: [Reflux.connect(todoListStore, "list")],
        getInitialState: function () {
            return {
                list: []
            };
        },
        render: function () {
            return (
                <div>
                    <TodoHeader />
                    <this.props.activeRouteHandler list={this.state.list} />
                    <TodoFooter list={this.state.list} />
                </div>
            );
        }
    });
