import React from 'react';
import { Modal, Table } from 'semantic-ui-react';

const databaseURL = "https://minchoom-cs473.firebaseio.com"

export default class SessionEndBtn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        // place for binding functions
    }

    render() {
        const { open, topThree } = this.props;
        const {} = this.state;
        const {} = this;
        return (
            <Modal open={open}>
                <Modal.Header>End of the Session & Leaderboard</Modal.Header>
                <Modal.Content image>
                <Modal.Description>
                    <span style={{lineHeight: '1.8', fontSize: '17px'}}>
                        Below is the top three student of the lecture! <br/>
                        Thanks for the active participation in today's class 😊
                    </span>
                    
                    <div className="ui centered grid" style={{padding: '20px', marginTop: '10px'}}>
                        <Table basic='very' celled collapsing className="ui center aligned container">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Rank</Table.HeaderCell>
                                        <Table.HeaderCell>Session Name</Table.HeaderCell>
                                        <Table.HeaderCell>Points</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {topThree.map((v, idx) => { return (
                                        <Table.Row>
                                            <Table.Cell>#{idx+1}</Table.Cell>
                                            <Table.Cell>{v[0]}</Table.Cell>
                                            <Table.Cell>{v[1]} points</Table.Cell>
                                        </Table.Row>
                                    )})}
                                </Table.Body>
                            </Table>
                    </div>
                </Modal.Description>
                </Modal.Content>
            </Modal>
        )
    }
}