package controllers

import de.htwg.se.bettler.model.cardComponent.CardInterface
import de.htwg.se.bettler.model.cardComponent.cardBaseImpl.{Card, Cards}
import de.htwg.se.bettler.model.gameComponent.Game
import de.htwg.se.bettler.model.stateComponent.GameStateContext
import de.htwg.se.bettler.model.stateComponent.stateBaseImpl.PlayerTurnState
import de.htwg.se.bettler.starter
import play.api.mvc._

import javax.inject._
import scala.util.{Failure, Success}


import java.io.{File, PrintWriter}


/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

  /**
   * Create an Action to render an HTML page.
   *
   * The configuration in the `routes` file means that this method
   * will be called when the application receives a `GET` request with
   * a path of `/`.
   */

  val controller = new starter().controller_return

  def retJson(): Action[AnyContent] = Action { implicit request: Request[AnyContent] =>
    val json = controller.return_j
    Ok(json)
  }

  def matchCards(cardinput: String): Set[CardInterface] = {
    val s = cardinput.split(" ")
    var l = Set.empty[CardInterface]
    for (i <- 0 to s.size - 1)
      Card(s(i)) match {
        case Success(c) => l = l + c

        case Failure(f) =>
      }
    return l
  }





  def index() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.index())

  }

  def create_game() = Action { implicit request: Request[AnyContent] =>
    controller.newGame("pvp")
    Ok(views.html.gameView(controller.toString, ""))
  }

  def playWeb(cardsinput: String) = Action { implicit request: Request[AnyContent] =>
    val l = matchCards(cardsinput)

    controller.doAndNotify(controller.play(_), (Cards(l)))
    Ok(views.html.gameView(controller.toString, " "))
  }

  def skipWeb() = Action { implicit request: Request[AnyContent] =>
    controller.doAndNotify(controller.skip)
    Ok(views.html.gameView(controller.toString, " "))
  }

  def undo() = Action { implicit request: Request[AnyContent] =>
    controller.undo
    Ok(views.html.gameView(controller.toString, " "))
  }

  def redo() = Action { implicit request: Request[AnyContent] =>
    controller.redo
    Ok(views.html.gameView(controller.toString, " "))
  }

  def about = Action {
    Ok(views.html.about())
  }

  //____________________________ 2playerVersion ____________________________
  def playerview() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.playerView(controller.return_j))
  }

  def create2P = Action {
    controller.doAndNotify(controller.newGame(_), "pvp")
    Ok(views.html.playerView(controller.return_j))

  }

  def newGame2P = Action {
    controller.doAndNotify(controller.newGame(_), "pvp")
    Ok(views.html.playerView(controller.return_j))

  }


  def playCard2P(cards: String) = Action { implicit request: Request[AnyContent] =>
    val l = matchCards(cards)
    controller.doAndNotify(controller.play(_), (Cards(l)))
    Ok(views.html.playerView(controller.return_j))

  }

  def Skip2P() = Action { implicit request: Request[AnyContent] =>
    controller.doAndNotify(controller.skip)
    Ok(views.html.playerView(controller.return_j))
  }






  //____________________________ 2playerVersion_END ____________________________



  def playCardBetter(cards: String) = Action {

    val l = matchCards(cards)
    controller.doAndNotify(controller.play(_), (Cards(l)))
    Ok(views.html.bettergameView(betterGameDataCreator(controller.game.get)))

  }

  def create_better_game = Action {
    controller.doAndNotify(controller.newGame(_), "pvp")
    Ok(views.html.bettergameView(betterGameDataCreator(controller.game.get)))

  }


  def betterSkip() = Action { implicit request: Request[AnyContent] =>
    controller.doAndNotify(controller.skip)
    Ok(views.html.bettergameView(betterGameDataCreator(controller.game.get)))
  }


  def betterundo() = Action { implicit request: Request[AnyContent] =>
    controller.undo
    Ok(views.html.bettergameView(betterGameDataCreator(controller.game.get)))

  }

  def betterredo() = Action { implicit request: Request[AnyContent] =>
    controller.redo
    Ok(views.html.bettergameView(betterGameDataCreator(controller.game.get)))
  }

  def nextRound() = Action { implicit request: Request[AnyContent] =>
    controller.doAndNotify(controller.nextRound)
    Ok(views.html.bettergameView(betterGameDataCreator(controller.game.get)))
  }




  def betterGameDataCreator(game: Game): betterGameData = {

    var currentPlayer = 0
    if (GameStateContext.state.isInstanceOf[PlayerTurnState])
      currentPlayer = GameStateContext.state.asInstanceOf[PlayerTurnState].currentPlayer + 1

    val gameData = betterGameData(playerformatter(
      game.getBoard().toString),
      playerformatter(game.getPlayers()(0).toString),
      playerformatter(game.getPlayers()(1).toString),
      game.getMessage(),
      (currentPlayer).toString
    )
    return gameData
  }




  def playerformatter(cards: String): String = {
    var i = 0
    var p = ""

    while (i <= cards.length() - 2) {

      p += cards(i)
      p += cards(i + 1)
      if (cards(i+1).toString.equals("1")) {
        p += cards(i + 2)
        p += " "
        i = i + 3

      }
      else {
        p += " "
        i = i + 2
      }


      }
    return p


  }


}


case class betterGameData(board: String, player1: String,player2: String,message: String,currentTurn:String)