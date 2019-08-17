import React, { Component } from "react";
import { Row, Col } from "../components/Grid";
import { List } from "../components/List";
import Jumbotron from "../components/Jumbotron";
import API from "../utils/API";
import Card from "../components/Card";
import Artist from "../components/Artist";

class Favorites extends Component {
    state = {
        favorites: [],
        message: "",
        loggedIn: false,
    }

    componentDidMount() {
        API.isLoggedIn()
            .then(user => {
                if (user.data.loggedIn) {
                    this.setState({
                        favorites: user.data.user.favorites,
                        loggedIn: true,
                    });
                    this.findAllFavorites();
                } else {
                    this.setState({
                        message: user.data.message,
                        loggedIn: false
                    });
                }
            })
            .catch(err => console.log(err));
    };

    findAllFavorites = () => {
        API.findAllFavorites()
            .then(res => {
                if (this.state.favorites.length) {
                    this.setState({
                        message: `You have ${this.state.favorites.length} favorite artists saved`
                    })
                } else {
                    this.setState({
                        message: "No favorites saved, search for an artist to save in your favorites."
                    })
                }
            })
            .catch((err) => console.log(err));
    };

    handleDelete = id => {
        const favorite = this.state.favorites.find(favorite => favorite.artistId === id);
        API.deleteFavorite({ artistId: favorite.artistId })
            .then(() => window.location.href = '/favorites')
    };

    render() {
        return (
            <>
                <Row>
                    <Col size="md-12">
                        <Jumbotron>
                            <h1>Favorites</h1>
                        </Jumbotron>
                    </Col>
                </Row>
                <Row>
                    <Col size="md-12">
                        <h2 className="text-center">{this.state.message}</h2>
                    </Col>
                </Row>
                <Row>
                    <Col size="md-12">
                        {this.state.favorites.length ? (
                            <Card title="Favorites">
                                <List>
                                    {this.state.favorites.map(favorite => (
                                        <Artist
                                            key={favorite._id}
                                            artist={favorite.artistName}
                                            label={favorite.label}
                                            genre={favorite.genre}
                                            website={favorite.website}
                                            faceartist={favorite.facebook}
                                            twitter={favorite.twitter}
                                            biography={favorite.biography}
                                            country={favorite.country}
                                            thumbnail={favorite.artistThumb}
                                            logo={favorite.artistLogo}
                                            fanart={favorite.artistFanart}
                                            fanart2={favorite.artistFanart2}
                                            fanart3={favorite.artistFanart3}
                                            musicVidLink={favorite.musicVideos}
                                            Button={() => (
                                                <button className="btn btn-danger my-3" onClick= {() => this.handleDelete(favorite.artistId)}>
                                                    Delete
                                                </button>
                                            )}
                                        >
                                        </Artist>
                                    ))}
                                </List>
                            </Card>
                        ) : <div></div>}
                    </Col>
                </Row>
            </>
        );
    }
};

export default Favorites;