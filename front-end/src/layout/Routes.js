import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import NewReservation from "./NewReservation";
import NewTables from "./NewTables";
import ReservationSeat from "./ReservationSeat";
import NewSearch from "./NewSearch";
import ReservationEditor from "./ReservationEditor";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const query = useQuery();
  const date = query.get("date");
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      
      <Route path="/reservations/new">
        <NewReservation />
      </Route>

      <Route path="/tables/new">
        <NewTables/>
      </Route>

      <Route path="/dashboard">
        <Dashboard date={date || today()} />
      </Route>

      <Route path="/reservations/:reservation_id/seat">
        <ReservationSeat />
      </Route>

      <Route path="/reservations/:reservation_id/edit">
        <ReservationEditor/>
      </Route>

      <Route exact={true} path="/search">
        <NewSearch />
      </Route>

      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
