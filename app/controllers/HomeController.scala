package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import de.htwg.se.bettler.starter
import de.htwg.se.bettler.model.cardComponent.{CardInterface, CardsInterface}
import de.htwg.se.bettler.model.cardComponent.cardBaseImpl.Card
import de.htwg.se.bettler.model.cardComponent.cardBaseImpl.Cards
import de.htwg.se.bettler.model.cardComponent._

import de.htwg.se.bettler.model.cardComponent.cardBaseImpl._
import de.htwg.se.bettler.controller.controllerBaseImp
import de.htwg.se.bettler.model.Field._
import de.htwg.se.bettler.model.{cardComponent, gameComponent}
import de.htwg.se.bettler.model.gameComponent.Game
import de.htwg.se.bettler.model.gameComponent.pvpGameImpl.PvPGame
import de.htwg.se.bettler.model.stateComponent.GameStateContext
import de.htwg.se.bettler.model.stateComponent.stateBaseImpl.PlayerTurnState

import scala.util.{Failure, Success, Try}






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


  def matchCards(cardinput: String): Set[CardInterface] = {
    val s = cardinput.split(" ")
    var l = Set.empty[CardInterface]
    for (i <- 0 to s.size - 1)
      Card(s(i)) match {
        case Success(c) => l = l + c
        case Failure(f) => println("fail")
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

  def playCardBetter(cards: String) = Action {

    val l = matchCards(cards)
    controller.doAndNotify(controller.play(_), (Cards(l)))

    val game = controller.game.get
    val board = game.getBoard().toString


    val player1 = game.getPlayers()(0).toString
    val player2 = game.getPlayers()(1).toString
    val p1 = playerformatter(player1)
    val p2 = playerformatter(player2)


    val message = game.getMessage()
    Ok(views.html.bettergameView(board, p1, p2, message))

  }

  def create_better_game = Action {
    controller.doAndNotify(controller.newGame(_), "pvp")


    val game = controller.game.get
    val board = game.getBoard().toString
    val player1 = game.getPlayers()(0).toString
    val player2 = game.getPlayers()(1).toString
    val message = game.getMessage()
    val p1 = playerformatter(player1)
    val p2 = playerformatter(player2)


    Ok(views.html.bettergameView(board, p1, p2, message))

  }


  def betterSkip() = Action { implicit request: Request[AnyContent] =>
    controller.doAndNotify(controller.skip)
    val game = controller.game.get
    val board = game.getBoard().toString

    val player1 = game.getPlayers()(0).toString
    val player2 = game.getPlayers()(1).toString
    val p1 = playerformatter(player1)
    val p2 = playerformatter(player2)
    val message = game.getMessage()
    Ok(views.html.bettergameView(board, p1, p2, message))
  }


  def betterundo() = Action { implicit request: Request[AnyContent] =>
    controller.undo
    val game = controller.game.get
    val board = game.getBoard().toString

    val player1 = game.getPlayers()(0).toString
    val player2 = game.getPlayers()(1).toString
    val p1 = playerformatter(player1)
    val p2 = playerformatter(player2)
    val message = game.getMessage()
    Ok(views.html.bettergameView(board, p1, p2, message))

  }

  def betterredo() = Action { implicit request: Request[AnyContent] =>
    controller.redo
    val game = controller.game.get
    val board = game.getBoard().toString

    val player1 = game.getPlayers()(0).toString
    val player2 = game.getPlayers()(1).toString
    val p1 = playerformatter(player1)
    val p2 = playerformatter(player2)
    val message = game.getMessage()
    Ok(views.html.bettergameView(board, p1, p2, message))
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