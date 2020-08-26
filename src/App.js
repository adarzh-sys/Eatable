import React from "react";
import Default from "./Default";
import { useMediaQuery } from "react-responsive";
import { Grid, Icon, Input, Segment } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
// import { Typography } from "@material-ui/core";
import axios from "axios";
import image from './eatable.png'


const Defaults = ({ children }) => {
		const isDesktop = useMediaQuery({ minWidth: 992 });
		return isDesktop ? children : null;
}
function App() {
	const [state, setState] = React.useState({
		location: null,
		restaurants: []
	});

	const handleSubmit = async e => {
		e.preventDefault();
		try {
			let { data } = await axios.get(
				`https://developers.zomato.com/api/v2.1/locations?query=${state.location}`,
				{
					headers: {
						"user-key": "f72eecdef158c7a3e63517d9583b4d1c",
						"content-type": "application/json"
					}
				}
			);
			let { latitude, longitude } = await data.location_suggestions[0];

			try {
				let { data } = await axios.get(
					`https://developers.zomato.com/api/v2.1/geocode?lat=${latitude}&lon=${longitude}`,
					{
						headers: {
							"user-key": "f72eecdef158c7a3e63517d9583b4d1c",
							"content-type": "application/json"
						}
					}
				);
				// console.log(data.nearby_restaurants);
				setState({ ...state, restaurants: data.nearby_restaurants });
			} catch (err) {
				console.log(err);
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<React.Fragment>
			<div style={{ background: 'rgb(203,32,45)', paddingBottom: '20px', paddingTop: "20px" }}>
				<div style={{
          display: "flex",
          justifyContent: "center",
		  alignItems: "center",
		//   width:"339px",
		//   height:'126px'
        }}>
				<img className='photo' src={image} />
				</div>
				{/* <Typography style={
					{
						textAlign: "center",
						paddingTop: '30px',
						margin: '0 10px',
						fontFamily: 'Shrikhand',
						fontSize: 90,
						color: 'rgb(203, 32, 45)'
					}}
					variant="h3"
				>
					eatable
			</Typography> */}
			</div>

			<br></br>
			<form
				// style={{ display: "flex", justifyContent: "center" }}
				onSubmit={handleSubmit}
			>
				<Segment placeholder>
					<Grid columns={1} stackable textAlign="center">
						<Grid.Column
							style={{ display: "flex", justifyContent: "center", fontFamily: 'Metropolis', fontSize: 80, fontWeight: 'bold'	}}
							width={4}
						>
							<Segment circular>{"Search for restaurants in your city!"}</Segment>
						</Grid.Column>
						<Grid.Row verticalAlign="middle">
							<Grid.Column>
								<Input
									icon={
										<Icon
											name="search"
											inverted
											circular
											link
											onClick={handleSubmit}
										/>
									}
									placeholder="Enter a city name..."
									onChange={e =>
										setState({ ...state, location: e.target.value })
									}
								/>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Segment>
			</form>
			<br></br>
			<Defaults>
				<Default restaurants={state.restaurants} />
			</Defaults>
		</React.Fragment>
	);
}

export default App;
