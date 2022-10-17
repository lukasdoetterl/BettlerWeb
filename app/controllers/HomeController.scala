package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import de.htwg.se.bettler.starter
import de.htwg.se.bettler.model.cardComponent.{CardInterface, CardsInterface}
import de.htwg.se.bettler.model.cardComponent.cardBaseImpl.Card
import de.htwg.se.bettler.model.cardComponent.cardBaseImpl.Cards
import de.htwg.se.bettler.controller.controllerBaseImp

import scala.util.{Try,Success,Failure}






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


  def index() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.index())

  }

  def create_game() = Action { implicit request: Request[AnyContent] =>
    controller.newGame("pvp")
    Ok(views.html.gameView(controller.toString, ""))
  }
  def playWeb(cardsinput: String) = Action { implicit request: Request[AnyContent] =>
    val s = cardsinput.split(" ")
    var l = Set.empty[CardInterface]
    for (i <- 0 to s.size - 1)
      Card(s(i)) match {
        case Success(c) => l = l + c
        case Failure(f) => println("fail")
      }

    controller.doAndNotify(controller.play(_),(Cards(l)))
    Ok(views.html.gameView(controller.toString," "))
}

  def skipWeb() = Action { implicit request: Request[AnyContent] =>
    controller.skip()
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
}
